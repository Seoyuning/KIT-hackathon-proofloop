"use client";

import Link from "next/link";
import { useState } from "react";
import { initialQuestionClusters, textbookBots, type QuestionCluster, type TextbookBot } from "@/lib/studio-data";
import {
  buildExamDraft,
  buildGroundedReply,
  buildLessonKit,
  recordQuestionCluster,
  type ExamDraft,
  type GroundedReply,
  type LessonKit,
} from "@/lib/studio-generation";
import {
  ExamQuestionCard,
  InfoBlock,
  MessageBubble,
  SectionHeader,
  SimpleListCard,
  type ChatMessage,
  UnitToggle,
} from "@/components/studio-ui";

const workspaceLinks = [
  { href: "#chat", label: "학생 대화" },
  { href: "#database", label: "질문 DB" },
  { href: "#teacher", label: "교사용 생성기" },
];

type TeacherMode = "lesson" | "exam";

function getDefaultLessonUnitIds(bot: TextbookBot) {
  return bot.sections.slice(0, 2).map((section) => section.id);
}

function getDefaultExamUnitIds(bot: TextbookBot) {
  return bot.sections.map((section) => section.id);
}

function createWelcomeMessage(bot: TextbookBot): ChatMessage {
  return {
    id: `welcome-${bot.id}`,
    role: "assistant",
    text: `${bot.grade} ${bot.subject} · ${bot.publisher} ${bot.textbookName} 봇입니다.\n교과서 범위 안에서만 답하고, 관련 단원과 쪽수를 함께 보여 줍니다.`,
  };
}

function toggleUnit(current: string[], nextId: string) {
  if (current.includes(nextId)) {
    return current.length === 1 ? current : current.filter((id) => id !== nextId);
  }

  return [...current, nextId];
}

function findCurrentBot(botId: string) {
  return textbookBots.find((bot) => bot.id === botId) ?? textbookBots[0];
}

function sortClusters(clusters: QuestionCluster[]) {
  return [...clusters].sort((left, right) => right.frequency - left.frequency);
}

function toAssistantMessage(reply: GroundedReply): ChatMessage {
  return {
    id: reply.messageId,
    role: "assistant",
    text: reply.answer,
    evidence: reply.evidence,
    followUp: reply.followUp,
    unitLabel: reply.sectionTitle ?? undefined,
  };
}

export default function StudioWorkbench() {
  const initialBot = textbookBots[0];
  const initialLessonUnitIds = getDefaultLessonUnitIds(initialBot);
  const initialExamUnitIds = getDefaultExamUnitIds(initialBot);
  const initialLessonFocus = `${initialBot.subject} 수업에서 학생 질문이 많은 개념부터 정리`;
  const initialExamPurpose = "중간고사 1회분";

  const [selectedBotId, setSelectedBotId] = useState(initialBot.id);
  const [messageSerial, setMessageSerial] = useState(1);
  const [teacherMode, setTeacherMode] = useState<TeacherMode>("lesson");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([createWelcomeMessage(initialBot)]);
  const [questionBank, setQuestionBank] = useState<QuestionCluster[]>(initialQuestionClusters);
  const [lessonUnitIds, setLessonUnitIds] = useState<string[]>(initialLessonUnitIds);
  const [lessonFocus, setLessonFocus] = useState(initialLessonFocus);
  const [lessonMinutes, setLessonMinutes] = useState(45);
  const [lessonKit, setLessonKit] = useState<LessonKit>(
    buildLessonKit(initialBot, initialLessonUnitIds, initialQuestionClusters, initialLessonFocus, 45),
  );
  const [examUnitIds, setExamUnitIds] = useState<string[]>(initialExamUnitIds);
  const [examPurpose, setExamPurpose] = useState(initialExamPurpose);
  const [examQuestionCount, setExamQuestionCount] = useState(3);
  const [examDraft, setExamDraft] = useState<ExamDraft>(
    buildExamDraft(initialBot, initialExamUnitIds, initialQuestionClusters, initialExamPurpose, 3),
  );

  const currentBot = findCurrentBot(selectedBotId);
  const currentClusters = sortClusters(questionBank.filter((cluster) => cluster.botId === currentBot.id));
  const currentQuestionVolume = currentClusters.reduce((total, cluster) => total + cluster.frequency, 0);
  const topClusters = currentClusters.slice(0, 3);
  const recentMessages = chatMessages.slice(-8);

  function syncTeacherOutputs(
    bot: TextbookBot,
    nextQuestionBank: QuestionCluster[],
    nextLessonUnitIds: string[],
    nextLessonFocus: string,
    nextLessonMinutes: number,
    nextExamUnitIds: string[],
    nextExamPurpose: string,
    nextExamQuestionCount: number,
  ) {
    setLessonKit(buildLessonKit(bot, nextLessonUnitIds, nextQuestionBank, nextLessonFocus, nextLessonMinutes));
    setExamDraft(buildExamDraft(bot, nextExamUnitIds, nextQuestionBank, nextExamPurpose, nextExamQuestionCount));
  }

  function handleBotChange(bot: TextbookBot) {
    const nextLessonUnitIds = getDefaultLessonUnitIds(bot);
    const nextExamUnitIds = getDefaultExamUnitIds(bot);
    const nextLessonFocus = `${bot.subject} 수업에서 학생 질문이 많은 개념부터 정리`;
    const nextExamPurpose = "중간고사 1회분";
    const nextExamQuestionCount = Math.min(3, nextExamUnitIds.length);

    setSelectedBotId(bot.id);
    setChatInput("");
    setChatMessages([createWelcomeMessage(bot)]);
    setLessonUnitIds(nextLessonUnitIds);
    setLessonFocus(nextLessonFocus);
    setLessonMinutes(45);
    setExamUnitIds(nextExamUnitIds);
    setExamPurpose(nextExamPurpose);
    setExamQuestionCount(nextExamQuestionCount);

    syncTeacherOutputs(
      bot,
      questionBank,
      nextLessonUnitIds,
      nextLessonFocus,
      45,
      nextExamUnitIds,
      nextExamPurpose,
      nextExamQuestionCount,
    );
  }

  function handleSendQuestion() {
    const question = chatInput.trim();

    if (!question) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${messageSerial}`,
      role: "user",
      text: question,
    };
    const reply = buildGroundedReply(currentBot, question, messageSerial + 1);
    const nextQuestionBank = recordQuestionCluster(questionBank, currentBot, question, reply);

    setChatMessages((current) => [...current, userMessage, toAssistantMessage(reply)]);
    setQuestionBank(nextQuestionBank);
    setChatInput("");
    setMessageSerial((current) => current + 2);

    syncTeacherOutputs(
      currentBot,
      nextQuestionBank,
      lessonUnitIds,
      lessonFocus,
      lessonMinutes,
      examUnitIds,
      examPurpose,
      examQuestionCount,
    );
  }

  function handleLessonGenerate() {
    setLessonKit(buildLessonKit(currentBot, lessonUnitIds, questionBank, lessonFocus, lessonMinutes));
  }

  function handleExamGenerate() {
    setExamDraft(buildExamDraft(currentBot, examUnitIds, questionBank, examPurpose, examQuestionCount));
  }

  return (
    <main className="studio-app px-3 py-3 sm:px-4 lg:px-5">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="app-sidebar-panel rounded-[28px] p-4 text-white lg:sticky lg:top-3 lg:h-[calc(100vh-24px)] lg:overflow-y-auto lg:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow text-xs text-white/64">ProofLoop Studio</p>
              <h1 className="mt-2 text-xl font-semibold">교과서 AI 워크스페이스</h1>
              <p className="mt-2 text-sm leading-6 text-white/72">
                학생 대화, 질문 DB, 교사용 생성기를 한 화면에서 운영합니다.
              </p>
            </div>
            <Link
              className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/88 transition-colors hover:bg-white/14"
              href="/"
            >
              홈
            </Link>
          </div>

          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/6 p-4">
            <p className="text-xs font-semibold tracking-[0.1em] text-white/58">현재 운영 상태</p>
            <div className="mt-3 grid gap-3">
              <SidebarMetric label="선택 봇" value={`${currentBot.grade} ${currentBot.subject}`} />
              <SidebarMetric label="질문 볼륨" value={`${currentQuestionVolume}건`} />
              <SidebarMetric label="활성 학생" value={`${currentBot.activeStudents}명`} />
            </div>
          </div>

          <div className="mt-6">
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

          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/6 p-4">
            <p className="text-sm font-semibold">학생 시작 질문</p>
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

          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/6 p-4">
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
        </aside>

        <div className="min-w-0 space-y-4">
          <header className="app-panel rounded-[28px] p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">Grounded Answering</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground">
                    {currentBot.publisher} {currentBot.textbookName}
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-navy">
                  {currentBot.grade} {currentBot.subject} 운영 대시보드
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                  학생용 교과서 챗봇에서 나온 질문을 실시간으로 묶고, 같은 데이터를 교사용 수업 자료와 시험지 초안 생성에
                  바로 연결합니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {workspaceLinks.map((item) => (
                  <a
                    key={item.href}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-foreground transition-transform duration-200 hover:-translate-y-0.5"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <WorkspaceMetric
                label="챗봇 커버 단원"
                value={`${currentBot.sections.length}개`}
                detail="현재 교과서에 연결된 단원 수"
              />
              <WorkspaceMetric
                label="누적 질문 빈도"
                value={`${currentQuestionVolume}회`}
                detail="질문 DB에 집계된 반복 질문량"
              />
              <WorkspaceMetric
                label="상위 오개념"
                value={topClusters[0]?.misconception ?? "아직 없음"}
                detail="현재 가장 자주 반복된 이해 공백"
              />
              <WorkspaceMetric
                label="교사 출력 상태"
                value={teacherMode === "lesson" ? "강의 자료" : "시험지 초안"}
                detail="오른쪽 생성기 패널의 현재 모드"
              />
            </div>
          </header>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
            <div className="min-w-0 space-y-4">
              <section id="chat" className="app-panel rounded-[28px] p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <SectionHeader
                    kicker="학생 대화"
                    title="학생용 교과서 챗봇"
                    copy="질문을 보내면 단원과 쪽수를 근거로 답하고, 해당 질문은 통합 DB에 자동으로 누적됩니다."
                  />
                  <div className="rounded-[20px] border border-line bg-white px-4 py-3 text-sm text-muted">
                    최근 대화 {recentMessages.length}건
                  </div>
                </div>

                <div className="app-scroll mt-6 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {recentMessages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-line bg-white/82 p-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-navy">학생 질문 입력</span>
                    <textarea
                      className="w-full rounded-[20px] border border-line bg-white px-4 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-muted/70 focus:border-teal"
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder={currentBot.starterPrompts[0]}
                      rows={4}
                      value={chatInput}
                    />
                  </label>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {currentBot.starterPrompts.slice(0, 2).map((prompt) => (
                        <button
                          key={prompt}
                          className="rounded-full border border-line bg-surface-strong px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white"
                          onClick={() => setChatInput(prompt)}
                          type="button"
                        >
                          예시 채우기
                        </button>
                      ))}
                    </div>
                    <button
                      className="inline-flex items-center justify-center rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                      onClick={handleSendQuestion}
                      type="button"
                    >
                      질문 보내기
                    </button>
                  </div>
                </div>
              </section>

              <section id="database" className="app-panel rounded-[28px] p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <SectionHeader
                    kicker="질문 DB"
                    title="통합 질문 클러스터"
                    copy="학생이 실제로 어떤 질문을 반복하는지, 어떤 오개념으로 묶이는지 바로 확인합니다."
                  />
                  <div className="rounded-[20px] border border-line bg-white px-4 py-3 text-sm text-muted">
                    클러스터 {currentClusters.length}개
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {currentClusters.map((cluster) => {
                    const section = currentBot.sections.find((item) => item.id === cluster.sectionId);

                    return (
                      <div key={cluster.id} className="rounded-[22px] border border-line bg-white/72 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-navy">{cluster.representativeQuestion}</p>
                            <p className="mt-1 text-sm text-muted">
                              {section?.title ?? "단원 미지정"} / {section?.pages ?? ""}
                            </p>
                          </div>
                          <span className="rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
                            {cluster.frequency}회
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
                          <InfoBlock label="오개념 태그" value={cluster.misconception} />
                          <InfoBlock label="교사용 액션" value={cluster.teacherAction} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="min-w-0 space-y-4">
              <section className="app-panel rounded-[28px] p-5 sm:p-6">
                <SectionHeader
                  kicker="교과서 범위"
                  title={`${currentBot.publisher} ${currentBot.textbookName}`}
                  copy="학생 답변은 아래 단원 카드 안의 교과서 근거와 쪽수를 사용합니다."
                />

                <div className="app-scroll mt-6 max-h-[380px] space-y-3 overflow-y-auto pr-1">
                  {currentBot.sections.map((section) => (
                    <div key={section.id} className="rounded-[22px] border border-line bg-white/72 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-navy">{section.title}</p>
                          <p className="mt-1 text-sm text-muted">{section.pages}</p>
                        </div>
                        <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                          교과서 근거
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-muted">{section.summary}</p>

                      <div className="mt-4 grid gap-3">
                        <InfoBlock label="답변 기준" value={section.citationFocus} />
                        <InfoBlock label="교사용 연결 포인트" value={section.teacherBridge} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="teacher" className="app-panel rounded-[28px] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <SectionHeader
                    kicker="교사용 생성기"
                    title="질문 DB 기반 결과물 생성"
                    copy="같은 질문 데이터를 강의 자료나 시험지 초안으로 즉시 변환합니다."
                  />

                  <div className="grid grid-cols-2 gap-2 rounded-[22px] bg-surface-strong p-1">
                    <TeacherModeButton
                      active={teacherMode === "lesson"}
                      label="강의 자료"
                      onClick={() => setTeacherMode("lesson")}
                    />
                    <TeacherModeButton
                      active={teacherMode === "exam"}
                      label="시험지 초안"
                      onClick={() => setTeacherMode("exam")}
                    />
                  </div>
                </div>

                {teacherMode === "lesson" ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[24px] border border-line bg-white/76 p-4">
                      <p className="text-sm font-semibold text-navy">수업 범위</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {currentBot.sections.map((section) => (
                          <UnitToggle
                            key={section.id}
                            active={lessonUnitIds.includes(section.id)}
                            label={section.title}
                            onClick={() => setLessonUnitIds((current) => toggleUnit(current, section.id))}
                          />
                        ))}
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-navy">수업 목표</span>
                          <input
                            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                            onChange={(event) => setLessonFocus(event.target.value)}
                            value={lessonFocus}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-navy">수업 시간</span>
                          <select
                            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                            onChange={(event) => setLessonMinutes(Number(event.target.value))}
                            value={lessonMinutes}
                          >
                            <option value={40}>40분</option>
                            <option value={45}>45분</option>
                            <option value={50}>50분</option>
                          </select>
                        </label>
                      </div>

                      <button
                        className="mt-4 inline-flex rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                        onClick={handleLessonGenerate}
                        type="button"
                      >
                        강의 자료 갱신
                      </button>
                    </div>

                    <div className="rounded-[24px] border border-line bg-surface-strong p-4">
                      <p className="text-sm font-semibold text-navy">{lessonKit.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{lessonKit.summary}</p>
                    </div>

                    <div className="grid gap-3">
                      {lessonKit.slideOutline.map((slide) => (
                        <div key={slide.title} className="rounded-[22px] border border-line bg-white/72 p-4">
                          <p className="text-sm font-semibold text-navy">{slide.title}</p>
                          <ul className="mt-3 space-y-2">
                            {slide.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-3 text-sm leading-6 text-muted">
                                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-current opacity-55" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <SimpleListCard items={lessonKit.checkQuestions} title="수업 중 확인 질문" />
                      <SimpleListCard items={lessonKit.teacherMemo} title="교사용 메모" />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[24px] border border-line bg-white/76 p-4">
                      <p className="text-sm font-semibold text-navy">시험 범위</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {currentBot.sections.map((section) => (
                          <UnitToggle
                            key={section.id}
                            active={examUnitIds.includes(section.id)}
                            label={section.title}
                            onClick={() => setExamUnitIds((current) => toggleUnit(current, section.id))}
                          />
                        ))}
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-navy">시험 목적</span>
                          <input
                            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                            onChange={(event) => setExamPurpose(event.target.value)}
                            value={examPurpose}
                          />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-navy">문항 수</span>
                          <select
                            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                            onChange={(event) => setExamQuestionCount(Number(event.target.value))}
                            value={examQuestionCount}
                          >
                            <option value={1}>1문항</option>
                            <option value={2}>2문항</option>
                            <option value={3}>3문항</option>
                          </select>
                        </label>
                      </div>

                      <button
                        className="mt-4 inline-flex rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                        onClick={handleExamGenerate}
                        type="button"
                      >
                        시험지 초안 갱신
                      </button>
                    </div>

                    <div className="rounded-[24px] border border-line bg-surface-strong p-4">
                      <p className="text-sm font-semibold text-navy">{examDraft.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{examDraft.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {examDraft.predictedTraps.map((trap) => (
                          <span key={trap} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground">
                            {trap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {examDraft.questions.map((question) => (
                        <ExamQuestionCard key={question.number} question={question} />
                      ))}
                    </div>

                    <SimpleListCard items={examDraft.reviewNotes} title="출제 후 활용 메모" />
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SidebarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-white/8 bg-black/12 px-3 py-2.5">
      <span className="text-sm text-white/68">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function WorkspaceMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[22px] border border-line bg-white/72 p-4">
      <p className="text-xs font-semibold tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-7 text-navy">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

function TeacherModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="app-segment rounded-[18px] px-4 py-2.5 text-sm font-semibold transition-all"
      data-active={active}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
