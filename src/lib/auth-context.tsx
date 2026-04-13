"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "student" | "teacher";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  grade: string | null;
  subject: string | null;
  createdAt: string;
}

interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  grade: string | null;
  subject: string | null;
  created_at: string;
}

export type AuthResult = { error: string | null; needsEmailConfirm?: boolean };

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  signup: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    grade?: string | null
  ) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<AuthResult>;
  updateSubject: (subject: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function toAuthUser(profile: Profile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    grade: profile.grade ?? null,
    subject: profile.subject ?? null,
    createdAt: profile.created_at,
  };
}

async function loadProfile(
  supabase: SupabaseClient,
  session: Session
): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, role, grade, subject, created_at")
    .eq("id", session.user.id)
    .maybeSingle<Profile>();

  if (error || !data) {
    // Profile trigger may not have fired yet — fall back to metadata.
    const meta = session.user.user_metadata ?? {};
    return {
      id: session.user.id,
      email: session.user.email ?? "",
      name: (meta.name as string) ?? "",
      role: ((meta.role as UserRole) ?? "student") satisfies UserRole,
      grade: (meta.grade as string) ?? null,
      subject: (meta.subject as string) ?? null,
      createdAt: session.user.created_at ?? new Date().toISOString(),
    };
  }

  return toAuthUser(data);
}

function mapAuthError(message: string): string {
  if (/Invalid login credentials/i.test(message))
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (/Email not confirmed/i.test(message))
    return "이메일 인증이 완료되지 않았습니다. 받은 편지함을 확인해 주세요.";
  if (/User already registered/i.test(message))
    return "이미 가입된 이메일입니다.";
  if (/Password should be at least/i.test(message))
    return "비밀번호는 6자 이상이어야 합니다.";
  return message;
}

function clearAuthCookies() {
  document.cookie.split(";").forEach((c) => {
    const name = c.trim().split("=")[0];
    if (name.startsWith("sb-")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Use server-side /api/auth/me to check session — avoids browser→Supabase issues
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!mounted) return;
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("[auth] session check failed", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    // Keepalive: ping Supabase every 4 minutes to prevent DB sleep
    const keepalive = setInterval(() => {
      fetch("/api/keepalive").catch(() => {});
    }, 4 * 60 * 1000);

    fetch("/api/keepalive").catch(() => {});

    return () => {
      mounted = false;
      clearInterval(keepalive);
    };
  }, []);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: UserRole,
      grade?: string | null
    ): Promise<AuthResult> => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      if (!trimmedEmail) return { error: "이메일을 입력해 주세요." };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
        return { error: "올바른 이메일 형식이 아닙니다." };
      if (!password) return { error: "비밀번호를 입력해 주세요." };
      if (password.length < 6)
        return { error: "비밀번호는 6자 이상이어야 합니다." };
      if (!trimmedName) return { error: "이름을 입력해 주세요." };

      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { name: trimmedName, role, grade: grade ?? null },
          emailRedirectTo,
        },
      });

      if (error) return { error: mapAuthError(error.message) };

      // If email confirmation is enabled, session will be null until the
      // user clicks the link in their inbox.
      const needsEmailConfirm = !data.session;
      return { error: null, needsEmailConfirm };
    },
    [supabase]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) return { error: "이메일을 입력해 주세요." };
      if (!password) return { error: "비밀번호를 입력해 주세요." };

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (error) return { error: mapAuthError(error.message) };
      return { error: null };
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[auth] signOut failed", err);
    } finally {
      setUser(null);
      clearAuthCookies();
    }
  }, [supabase]);

  const updateName = useCallback(
    async (name: string): Promise<AuthResult> => {
      const trimmed = name.trim();
      if (!trimmed) return { error: "이름을 입력해 주세요." };
      if (!user) return { error: "로그인이 필요합니다." };

      const { error } = await supabase
        .from("profiles")
        .update({ name: trimmed })
        .eq("id", user.id);
      if (error) return { error: error.message };

      await supabase.auth.updateUser({ data: { name: trimmed } });
      setUser({ ...user, name: trimmed });
      return { error: null };
    },
    [supabase, user]
  );

  const updateSubject = useCallback(
    async (subject: string): Promise<AuthResult> => {
      if (!user) return { error: "로그인이 필요합니다." };

      const { error } = await supabase
        .from("profiles")
        .update({ subject })
        .eq("id", user.id);
      if (error) return { error: error.message };

      await supabase.auth.updateUser({ data: { subject } });
      setUser({ ...user, subject });
      return { error: null };
    },
    [supabase, user]
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<AuthResult> => {
      if (!newPassword) return { error: "새 비밀번호를 입력해 주세요." };
      if (newPassword.length < 6)
        return { error: "비밀번호는 6자 이상이어야 합니다." };
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: mapAuthError(error.message) };
      return { error: null };
    },
    [supabase]
  );

  const resendConfirmation = useCallback(
    async (email: string): Promise<AuthResult> => {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed) return { error: "이메일을 입력해 주세요." };
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: trimmed,
        options: { emailRedirectTo },
      });
      if (error) return { error: mapAuthError(error.message) };
      return { error: null };
    },
    [supabase]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signup,
        login,
        logout,
        updateName,
        updateSubject,
        updatePassword,
        resendConfirmation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
