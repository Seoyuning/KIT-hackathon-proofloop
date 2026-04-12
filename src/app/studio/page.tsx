"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function StudioIndex() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  // Fallback: if auth stays loading too long, send to login.
  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), 25000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (isLoading && !timedOut) return;
    if (!user) {
      router.replace("/studio/login");
      return;
    }
    router.replace(user.role === "student" ? "/studio/chat" : "/studio/analysis");
  }, [user, isLoading, timedOut, router]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
      <p className="text-sm text-muted">이동 중…</p>
    </div>
  );
}
