"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "student" | "teacher";

export interface AuthUser {
  name: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  signup: (name: string, role: UserRole) => void;
  login: (name: string) => AuthUser | null;
  logout: () => void;
}

const STORAGE_KEY = "proofloop-users";
const SESSION_KEY = "proofloop-session";

function getStoredUsers(): Record<string, AuthUser> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function setStoredUsers(users: Record<string, AuthUser>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

function setSession(name: string | null) {
  if (name) {
    localStorage.setItem(SESSION_KEY, name);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
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

  // Restore session on mount
  useEffect(() => {
    const sessionName = getSession();
    if (sessionName) {
      const users = getStoredUsers();
      const found = users[sessionName];
      if (found) {
        setUser(found);
      } else {
        setSession(null);
      }
    }
    setIsLoading(false);
  }, []);

  function signup(name: string, role: UserRole) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newUser: AuthUser = { name: trimmed, role };
    const users = getStoredUsers();
    users[trimmed] = newUser;
    setStoredUsers(users);
    setSession(trimmed);
    setUser(newUser);
  }

  function login(name: string): AuthUser | null {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const users = getStoredUsers();
    const found = users[trimmed];
    if (found) {
      setSession(trimmed);
      setUser(found);
      return found;
    }
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
