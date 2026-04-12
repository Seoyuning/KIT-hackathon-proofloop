"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, updateName, updatePassword, logout } = useAuth();

  const [name, setName] = useState("");
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync form name with loaded user — "adjust state during render" pattern.
  if (user && user.id !== syncedUserId) {
    setSyncedUserId(user.id);
    setName(user.name);
  }

  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/studio/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <p className="text-sm text-muted">로딩 중...</p>
      </div>
    );
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameMessage(null);
    setNameSaving(true);
    const result = await updateName(name);
    setNameSaving(false);
    if (result.error) setNameMessage({ type: "error", text: result.error });
    else setNameMessage({ type: "ok", text: "이름이 저장되었습니다." });
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage(null);
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: "error", text: "새 비밀번호가 일치하지 않습니다." });
      return;
    }
    setPwSaving(true);
    const result = await updatePassword(newPassword);
    setPwSaving(false);
    if (result.error) {
      setPwMessage({ type: "error", text: result.error });
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPwMessage({ type: "ok", text: "비밀번호가 변경되었습니다." });
  }

  function handleLogout() {
    logout().finally(() => {
      window.location.href = "/studio/login";
    });
  }

  const roleLabel = user.role === "student" ? "학생" : "교사";
  const created = new Date(user.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      <div className="app-panel rounded-[28px] p-6">
        <p className="eyebrow text-xs text-muted">ProofLoop Studio</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-navy">마이페이지</h1>
        <p className="mt-1 text-sm text-muted">계정 정보와 로그인 정보를 관리합니다.</p>
      </div>

      {/* Account summary */}
      <section className="app-panel rounded-[28px] p-6">
        <h2 className="text-lg font-semibold text-navy">계정 정보</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-[18px] border border-line bg-white p-4">
            <dt className="text-xs font-semibold text-muted">이메일</dt>
            <dd className="mt-1 text-navy">{user.email}</dd>
          </div>
          <div className="rounded-[18px] border border-line bg-white p-4">
            <dt className="text-xs font-semibold text-muted">역할</dt>
            <dd className="mt-1 text-navy">
              {roleLabel}
              <span className="ml-2 text-xs text-muted">(가입 시 결정 · 변경 불가)</span>
            </dd>
          </div>
          <div className="rounded-[18px] border border-line bg-white p-4">
            <dt className="text-xs font-semibold text-muted">가입일</dt>
            <dd className="mt-1 text-navy">{created}</dd>
          </div>
          <div className="rounded-[18px] border border-line bg-white p-4">
            <dt className="text-xs font-semibold text-muted">사용자 ID</dt>
            <dd className="mt-1 break-all font-mono text-xs text-muted">{user.id}</dd>
          </div>
        </dl>
      </section>

      {/* Profile edit */}
      <section className="app-panel rounded-[28px] p-6">
        <h2 className="text-lg font-semibold text-navy">프로필</h2>
        <p className="mt-1 text-sm text-muted">이름을 수정할 수 있습니다.</p>
        <form onSubmit={handleSaveName} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">이름</span>
            <input
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {nameMessage && (
            <p
              className={`rounded-xl px-4 py-2.5 text-sm ${
                nameMessage.type === "ok" ? "bg-teal/10 text-navy" : "bg-red/10 text-red"
              }`}
            >
              {nameMessage.text}
            </p>
          )}
          <button
            type="submit"
            disabled={nameSaving || name.trim() === user.name}
            className="whitespace-nowrap rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {nameSaving ? "저장 중..." : "이름 저장"}
          </button>
        </form>
      </section>

      {/* Password change */}
      <section className="app-panel rounded-[28px] p-6">
        <h2 className="text-lg font-semibold text-navy">비밀번호 변경</h2>
        <p className="mt-1 text-sm text-muted">새 비밀번호는 6자 이상이어야 합니다.</p>
        <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">새 비밀번호</span>
            <input
              type="password"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">새 비밀번호 확인</span>
            <input
              type="password"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          {pwMessage && (
            <p
              className={`rounded-xl px-4 py-2.5 text-sm ${
                pwMessage.type === "ok" ? "bg-teal/10 text-navy" : "bg-red/10 text-red"
              }`}
            >
              {pwMessage.text}
            </p>
          )}
          <button
            type="submit"
            disabled={pwSaving || !newPassword}
            className="whitespace-nowrap rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pwSaving ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="app-panel rounded-[28px] p-6">
        <h2 className="text-lg font-semibold text-navy">세션</h2>
        <p className="mt-1 text-sm text-muted">
          현재 기기에서 로그아웃합니다. 다시 로그인하려면 이메일과 비밀번호가 필요합니다.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 whitespace-nowrap rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-red hover:text-red"
        >
          로그아웃
        </button>
      </section>
    </div>
  );
}
