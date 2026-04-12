"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, type UserRole } from "@/lib/auth-context";

type Mode = "login" | "signup";

const roleOptions: { id: UserRole; label: string; icon: string; description: string }[] = [
  { id: "student", label: "학생", icon: "📖", description: "교과서 질문 · 근거 답변" },
  { id: "teacher", label: "교사", icon: "📋", description: "질문 분석 · 수업 도구" },
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, login, resendConfirmation, user, isLoading } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect already-logged-in users away from login page.
  useEffect(() => {
    if (isLoading || !user) return;
    router.replace(user.role === "student" ? "/studio/chat" : "/studio/analysis");
  }, [user, isLoading, router]);

  const callbackError =
    searchParams.get("error") === "auth_callback"
      ? "이메일 인증 링크가 만료되었거나 올바르지 않습니다. 다시 시도해 주세요."
      : "";
  const displayError = error || callbackError;

  async function handleLogin() {
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      // Auth state listener will populate `user`; redirect handled by effect above.
    } catch {
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignup() {
    setSubmitting(true);
    try {
      const result = await signup(email, password, name, selectedRole);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.needsEmailConfirm) {
        setNotice(
          `${email.trim()} 주소로 인증 메일을 보냈습니다. 메일함에서 링크를 클릭해 가입을 완료해 주세요.`
        );
        return;
      }
      // Auto-confirm is on — redirect will happen via effect.
    } catch {
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    const result = await resendConfirmation(email);
    if (result.error) setError(result.error);
    else setNotice("인증 메일을 다시 보냈습니다.");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (mode === "login") handleLogin();
    else handleSignup();
  }

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="eyebrow text-xs text-muted">ProofLoop Studio</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-navy">
            {mode === "login" ? "로그인" : "회원가입"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "이메일과 비밀번호로 로그인하세요."
              : "계정을 만들고 역할을 선택하세요."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 app-panel rounded-[28px] p-6 space-y-5">
          {/* Email */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">이메일</span>
            <input
              type="email"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>

          {/* Password */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">비밀번호</span>
            <input
              type="password"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
              placeholder={mode === "signup" ? "6자 이상" : "비밀번호를 입력하세요"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {/* Signup-only fields */}
          {mode === "signup" && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-navy">이름</span>
                <input
                  className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <div>
                <p className="mb-3 text-sm font-medium text-navy">역할 선택</p>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`rounded-[22px] border p-4 text-left transition-all ${
                        selectedRole === r.id
                          ? "border-teal bg-teal/8 shadow-md"
                          : "border-line bg-white hover:border-teal/40"
                      }`}
                      onClick={() => setSelectedRole(r.id)}
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <p className="mt-2 text-sm font-semibold text-navy">{r.label}</p>
                      <p className="mt-1 text-xs text-muted">{r.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {displayError && (
            <p className="rounded-xl bg-red/10 px-4 py-2.5 text-sm text-red">{displayError}</p>
          )}

          {notice && (
            <div className="rounded-xl bg-teal/10 px-4 py-3 text-sm text-navy">
              <p>{notice}</p>
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-teal hover:underline"
                onClick={handleResend}
              >
                인증 메일 다시 보내기
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full whitespace-nowrap rounded-full bg-navy py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
          </button>

          <p className="text-center text-sm text-muted">
            {mode === "login" ? (
              <>
                처음이신가요?{" "}
                <button
                  type="button"
                  className="font-semibold text-teal hover:underline"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setNotice("");
                  }}
                >
                  회원가입
                </button>
              </>
            ) : (
              <>
                이미 가입하셨나요?{" "}
                <button
                  type="button"
                  className="font-semibold text-teal hover:underline"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setNotice("");
                  }}
                >
                  로그인
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
