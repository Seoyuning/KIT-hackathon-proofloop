"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { textbookBots } from "@/lib/studio-data";
import { StudioProvider, useStudio } from "@/lib/studio-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

function SidebarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-white/8 bg-black/12 px-3 py-2.5">
      <span className="text-sm text-white/68">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

const studentNav = [
  { href: "/studio/chat", label: "질문하기" },
  { href: "/studio/mypage", label: "마이페이지" },
];

const teacherNav = [
  { href: "/studio/analysis", label: "질문 분석" },
  { href: "/studio/generate", label: "수업 도구" },
  { href: "/studio/mypage", label: "마이페이지" },
];

function StudioSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currentBot, handleBotChange, currentQuestionVolume, topClusters, setChatInput } = useStudio();

  const role = user?.role ?? null;
  const navItems = role === "student" ? studentNav : role === "teacher" ? teacherNav : [];

  async function handleLogout() {
    await logout();
    router.push("/studio/login");
  }

  return (
    <aside className="app-sidebar-panel rounded-[28px] p-4 text-white lg:sticky lg:top-3 lg:h-[calc(100vh-24px)] lg:overflow-y-auto lg:p-5 app-scroll">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-xs text-white/64">ProofLoop Studio</p>
          <h1 className="mt-2 text-xl font-semibold">교과서 AI 워크스페이스</h1>
          {user && (
            <p className="mt-2 text-sm leading-6 text-white/72">
              {user.name}님 ({user.role === "student" ? "학생" : "교사"})
            </p>
          )}
        </div>
        {user && (
          <button
            className="whitespace-nowrap rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/88 transition-colors hover:bg-white/14"
            onClick={handleLogout}
            type="button"
          >
            로그아웃
          </button>
        )}
      </div>

      {role && (
        <>
          {/* Navigation */}
          <div className="mt-5 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-white text-navy shadow-lg"
                    : "border border-white/10 bg-white/8 text-white/82 hover:bg-white/14"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Status */}
          <div className="mt-5 rounded-[22px] border border-white/10 bg-white/6 p-4">
            <p className="text-xs font-semibold tracking-[0.1em] text-white/58">현재 운영 상태</p>
            <div className="mt-3 grid gap-3">
              <SidebarMetric label="선택 봇" value={`${currentBot.grade} ${currentBot.subject}`} />
              <SidebarMetric label="질문 볼륨" value={`${currentQuestionVolume}건`} />
              <SidebarMetric label="활성 학생" value={`${currentBot.activeStudents}명`} />
            </div>
          </div>

          {/* Bot list */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">교과서 봇</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/68">{textbookBots.length}종</span>
            </div>
            <div className="mt-3 space-y-2">
              {textbookBots.map((bot) => (
                <button
                  key={bot.id}
                  className={`w-full rounded-[20px] border px-4 py-3 text-left transition-all ${
                    currentBot.id === bot.id
                      ? "border-transparent bg-white text-navy shadow-lg"
                      : "border-white/10 bg-white/6 text-white hover:bg-white/10"
                  }`}
                  onClick={() => handleBotChange(bot)}
                  type="button"
                >
                  <p className={`text-xs font-semibold ${currentBot.id === bot.id ? "text-muted" : "text-white/58"}`}>
                    {bot.schoolLevel} {bot.grade} · {bot.subject}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{bot.publisher} {bot.textbookName}</p>
                  <p className={`mt-2 line-clamp-2 text-xs leading-5 ${currentBot.id === bot.id ? "text-muted" : "text-white/72"}`}>
                    {bot.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Student: starter prompts */}
          {role === "student" && (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-semibold">시작 질문</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentBot.starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-left text-xs leading-5 text-white/82 transition-colors hover:bg-white/12"
                    onClick={() => setChatInput(prompt)}
                    type="button"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teacher: trending questions */}
          {role === "teacher" && topClusters.length > 0 && (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-semibold">지금 많이 나오는 질문</p>
              <div className="mt-3 space-y-3">
                {topClusters.map((cluster) => (
                  <div key={cluster.id} className="rounded-[18px] border border-white/8 bg-black/10 p-3">
                    <p className="text-sm leading-6 text-white">{cluster.representativeQuestion}</p>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-white/62">
                      <span>{cluster.misconception}</span>
                      <span>{cluster.frequency}회</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}

/** Pages that don't need the sidebar (login, role select) */
const noSidebarPaths = ["/studio/login", "/studio"];

function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !noSidebarPaths.includes(pathname);

  if (!showSidebar) {
    return (
      <main className="studio-app px-3 py-3 sm:px-4 lg:px-5">
        <div className="mx-auto max-w-[1600px]">{children}</div>
      </main>
    );
  }

  return (
    <main className="studio-app px-3 py-3 sm:px-4 lg:px-5">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <StudioSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StudioProvider>
        <StudioShell>{children}</StudioShell>
      </StudioProvider>
    </AuthProvider>
  );
}
