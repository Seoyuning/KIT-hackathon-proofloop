"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { textbookBots, type TextbookBot } from "@/lib/studio-data";
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

function JoinClassWidget() {
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [joinedClasses, setJoinedClasses] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetch("/api/classes").then((r) => r.json()).then((d) => {
      setJoinedClasses(d.classes?.map((c: any) => ({ id: c.id, name: c.name })) ?? []);
    }).catch(() => {});
  }, []);

  async function handleJoin() {
    if (!code.trim()) return;
    setJoining(true);
    setMessage(null);
    try {
      const res = await fetch("/api/classes/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });
      const data = await res.json();
      if (data.error) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({ type: "ok", text: `"${data.class.name}" 반에 참여했습니다!` });
        setJoinedClasses((c) => [...c, { id: data.class.id, name: data.class.name }]);
        setCode("");
      }
    } catch {
      setMessage({ type: "error", text: "서버에 연결할 수 없습니다." });
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="mt-5 rounded-[22px] border border-white/10 bg-white/6 p-4">
      <p className="text-sm font-semibold">내 반</p>
      {joinedClasses.length > 0 && (
        <div className="mt-2 space-y-1">
          {joinedClasses.map((c) => (
            <div key={c.id} className="rounded-[14px] border border-white/8 bg-black/10 px-3 py-2 text-xs text-white/82">
              {c.name}
            </div>
          ))}
        </div>
      )}
      <div className="mt-3">
        <input
          className="w-full rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-teal"
          placeholder="초대 코드 입력"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
        />
        <button
          className="mt-2 w-full rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal/80 disabled:opacity-60"
          onClick={handleJoin}
          disabled={joining || !code.trim()}
          type="button"
        >
          {joining ? "참여 중..." : "반 참여하기"}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs ${message.type === "ok" ? "text-teal" : "text-orange"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

const teacherNav = [
  { href: "/studio/analysis", label: "질문 분석" },
  { href: "/studio/generate", label: "수업 도구" },
  { href: "/studio/classes", label: "반 관리" },
  { href: "/studio/mypage", label: "마이페이지" },
];

function AddBotModal({ onClose, onAdd }: { onClose: () => void; onAdd: (bot: TextbookBot) => void }) {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [publisher, setPublisher] = useState("");
  const [bookName, setBookName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grade.trim() || !subject.trim() || !publisher.trim() || !bookName.trim()) return;
    const id = `custom-${Date.now()}`;
    const bot: TextbookBot = {
      id,
      schoolLevel: grade.includes("중") ? "중등" : "고등",
      grade: grade.trim(),
      subject: subject.trim(),
      publisher: publisher.trim(),
      textbookName: bookName.trim(),
      description: `${grade.trim()} ${subject.trim()} 교과서 챗봇`,
      distributionLabel: "사용자 추가",
      activeStudents: 0,
      starterPrompts: [
        `${subject.trim()}에서 가장 중요한 개념을 설명해줘.`,
        `이 단원에서 자주 틀리는 부분이 뭐야?`,
      ],
      sections: [],
    };
    onAdd(bot);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <form
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-navy">교과서 봇 추가</h2>
        <p className="mt-1 text-sm text-muted">교과서 정보를 입력하면 AI 챗봇이 생성됩니다.</p>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-navy">학년</span>
            <input className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal" placeholder="예: 고1, 중2" value={grade} onChange={(e) => setGrade(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-navy">과목</span>
            <input className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal" placeholder="예: 수학, 과학, 국어" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-navy">출판사</span>
            <input className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal" placeholder="예: 비상교육, 미래엔" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-navy">교과서명</span>
            <input className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal" placeholder="예: 수학 I, 과학 2" value={bookName} onChange={(e) => setBookName(e.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gray-50">
            취소
          </button>
          <button type="submit" className="flex-1 rounded-full bg-navy py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal">
            추가
          </button>
        </div>
      </form>
    </div>
  );
}

function StudioSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { allBots, currentBot, handleBotChange, addCustomBot, currentQuestionVolume, topClusters, setChatInput, currentStudentWeaknesses } = useStudio();
  const [showAddBot, setShowAddBot] = useState(false);

  const role = user?.role ?? null;
  const navItems = role === "student" ? studentNav : role === "teacher" ? teacherNav : [];

  function handleLogout() {
    logout().finally(() => {
      window.location.href = "/studio/login";
    });
  }

  return (
    <>
    {showAddBot && <AddBotModal onClose={() => setShowAddBot(false)} onAdd={addCustomBot} />}
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
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  pathname === item.href
                    ? "bg-teal text-white shadow-lg"
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
              <SidebarMetric label="참여 학생" value={`${currentStudentWeaknesses.length}명`} />
            </div>
          </div>

          {/* Bot list */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">교과서 봇</p>
              <button
                className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-teal/80"
                onClick={() => setShowAddBot(true)}
                type="button"
              >
                + 추가
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {allBots.map((bot) => (
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

          {/* Student: join class */}
          {role === "student" && <JoinClassWidget />}

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
    </>
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
