"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useStudio } from "@/lib/studio-context";
import { MessageBubble, SectionHeader } from "@/components/studio-ui";

export default function StudentChatPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { currentBot, chatInput, setChatInput, chatMessages, chatLoading, handleSendQuestion } = useStudio();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/studio/login"); return; }
    if (user.role !== "student") { router.replace("/studio/analysis"); }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "student") return null;

  const recentMessages = chatMessages.slice(-12);

  return (
    <div className="space-y-4">
      <header className="app-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">Grounded Answering</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground">
            {currentBot.publisher} {currentBot.textbookName}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-navy sm:text-3xl">
          {currentBot.grade} {currentBot.subject} 교과서 챗봇
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          질문을 보내면 교과서 단원과 쪽수를 근거로 답변합니다. 이해가 안 되는 부분을 자유롭게 물어보세요.
        </p>
      </header>

      <section className="app-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            kicker="학생 대화"
            title="질문과 답변"
            copy="교과서 범위 안에서 근거를 포함해 답변합니다. 질문은 자동으로 데이터에 누적됩니다."
          />
          <div className="rounded-[20px] border border-line bg-white px-4 py-3 text-sm text-muted">
            대화 {recentMessages.length}건
          </div>
        </div>

        <div className="app-scroll mt-6 max-h-[560px] space-y-3 overflow-y-auto pr-1">
          {recentMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {chatLoading && (
            <div className="rounded-[26px] border border-line bg-white/72 p-4">
              <p className="text-sm font-semibold text-navy">교과서 챗봇</p>
              <p className="mt-3 text-sm text-muted animate-pulse">답변을 생성하고 있습니다...</p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-[24px] border border-line bg-white/82 p-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">질문 입력</span>
            <textarea
              className="w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-muted/70 focus:border-teal"
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendQuestion();
                }
              }}
              placeholder={currentBot.starterPrompts[0]}
              rows={3}
              value={chatInput}
            />
          </label>

          <div className="mt-4 flex items-center justify-end">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSendQuestion}
              disabled={chatLoading}
              type="button"
            >
              {chatLoading ? "답변 생성 중..." : "질문 보내기"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
