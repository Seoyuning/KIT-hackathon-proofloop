"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "student" | "teacher";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

interface StoredUser {
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  signup: (email: string, password: string, name: string, role: UserRole) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
}

const STORAGE_KEY = "proofloop-users";
const SESSION_KEY = "proofloop-session";

/** Simple hash for localStorage MVP — NOT production-grade. */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

function getStoredUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setStoredUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

function setSession(email: string | null) {
  if (email) {
    localStorage.setItem(SESSION_KEY, email);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function toAuthUser(stored: StoredUser): AuthUser {
  return { email: stored.email, name: stored.name, role: stored.role };
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionEmail = getSession();
    if (sessionEmail) {
      const users = getStoredUsers();
      const found = users[sessionEmail];
      if (found) {
        setUser(toAuthUser(found));
      } else {
        setSession(null);
      }
    }
    setIsLoading(false);
  }, []);

  /** Returns error message or null on success. */
  function signup(email: string, password: string, name: string, role: UserRole): string | null {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail) return "이메일을 입력해 주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return "올바른 이메일 형식이 아닙니다.";
    if (!password) return "비밀번호를 입력해 주세요.";
    if (password.length < 4) return "비밀번호는 4자 이상이어야 합니다.";
    if (!trimmedName) return "이름을 입력해 주세요.";

    const users = getStoredUsers();
    if (users[trimmedEmail]) return "이미 가입된 이메일입니다.";

    const newUser: StoredUser = {
      email: trimmedEmail,
      name: trimmedName,
      role,
      passwordHash: simpleHash(password),
    };
    users[trimmedEmail] = newUser;
    setStoredUsers(users);
    setSession(trimmedEmail);
    setUser(toAuthUser(newUser));
    return null;
  }

  /** Returns error message or null on success. */
  function login(email: string, password: string): string | null {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) return "이메일을 입력해 주세요.";
    if (!password) return "비밀번호를 입력해 주세요.";

    const users = getStoredUsers();
    const found = users[trimmedEmail];
    if (!found) return "등록되지 않은 이메일입니다.";
    if (found.passwordHash !== simpleHash(password)) return "비밀번호가 일치하지 않습니다.";

    setSession(trimmedEmail);
    setUser(toAuthUser(found));
    return null;
  }

  function logout() {
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
