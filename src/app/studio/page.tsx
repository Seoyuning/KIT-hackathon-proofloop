"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function StudioIndex() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/studio/login");
    } else if (user.role === "student") {
      router.replace("/studio/chat");
    } else {
      router.replace("/studio/analysis");
    }
  }, [user, isLoading, router]);

  // Loading state
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
      <p className="text-sm text-muted">로딩 중...</p>
    </div>
  );
}
