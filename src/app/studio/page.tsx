"use client";

import { useEffect } from "react";

export default function StudioIndex() {
  useEffect(() => {
    // Check session via server API — fast and reliable
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          const dest = data.user.role === "teacher" ? "/studio/analysis" : "/studio/chat";
          window.location.href = dest;
        } else {
          window.location.href = "/studio/login";
        }
      })
      .catch(() => {
        window.location.href = "/studio/login";
      });
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
      <p className="text-sm text-muted">이동 중…</p>
    </div>
  );
}
