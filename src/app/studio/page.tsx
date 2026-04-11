"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function StudioIndex() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/studio/login");
      return;
    }
    router.replace(user.role === "student" ? "/studio/chat" : "/studio/analysis");
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
      <p className="text-sm text-muted">이동 중…</p>
    </div>
  );
}
