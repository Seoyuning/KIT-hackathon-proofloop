"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { initialQuestionClusters, initialStudentWeaknesses, textbookBots, type QuestionCluster, type StudentWeakness, type TextbookBot } from "@/lib/studio-data";
import {
  buildExamDraft,
  buildGroundedReply,
  buildLessonKit,
  recordQuestionCluster,
  type ExamDraft,
  type LessonKit,
} from "@/lib/studio-generation";
import type { ChatMessage } from "@/components/studio-ui";

function createWelcomeMessage(bot: TextbookBot): ChatMessage {
  return {
    id: `welcome-${bot.id}`,
    role: "assistant",
    text: `${bot.grade} ${bot.subject} · ${bot.publisher} ${bot.textbookName} 봇입니다.\n교과서 범위 안에서만 답하고, 관련 단원과 쪽수를 함께 보여 줍니다.`,
  };
}

function getDefaultLessonUnitIds(bot: TextbookBot) {
  return bot.sections.slice(0, 2).map((s) => s.id);
}

function getDefaultExamUnitIds(bot: TextbookBot) {
  return bot.sections.map((s) => s.id);
}

export function toggleUnit(current: string[], nextId: string) {
  if (current.includes(nextId)) {
    return current.length === 1 ? current : current.filter((id) => id !== nextId);
  }
  return [...current, nextId];
}

export function sortClusters(clusters: QuestionCluster[]) {
  return [...clusters].sort((a, b) => b.frequency - a.frequency);
}

type TeacherMode = "lesson" | "exam";

interface StudioState {
  /* bot */
  allBots: TextbookBot[];
  currentBot: TextbookBot;
  handleBotChange: (bot: TextbookBot) => void;
  addCustomBot: (bot: TextbookBot) => void;

  /* class */
  activeClassId: string | null;
  setActiveClassId: (id: string | null) => void;

  /* chat */
  chatInput: string;
  setChatInput: (v: string) => void;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  handleSendQuestion: () => void;

  /* question db */
  questionBank: QuestionCluster[];
  currentClusters: QuestionCluster[];
  currentQuestionVolume: number;
  topClusters: QuestionCluster[];
  currentStudentWeaknesses: StudentWeakness[];

  /* teacher: lesson */
  teacherMode: TeacherMode;
  setTeacherMode: (m: TeacherMode) => void;
  lessonUnitIds: string[];
  setLessonUnitIds: (fn: (c: string[]) => string[]) => void;
  lessonFocus: string;
  setLessonFocus: (v: string) => void;
  lessonMinutes: number;
  setLessonMinutes: (v: number) => void;
  lessonKit: LessonKit;
  handleLessonGenerate: () => void;

  /* teacher: exam */
  examUnitIds: string[];
  setExamUnitIds: (fn: (c: string[]) => string[]) => void;
  examPurpose: string;
  setExamPurpose: (v: string) => void;
  examQuestionCount: number;
  setExamQuestionCount: (v: number) => void;
  examDraft: ExamDraft;
  handleExamGenerate: () => void;
}

const StudioContext = createContext<StudioState | null>(null);

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const initialBot = textbookBots[0];
  const initialLessonUnitIds = getDefaultLessonUnitIds(initialBot);
  const initialExamUnitIds = getDefaultExamUnitIds(initialBot);

  const [customBots, setCustomBots] = useState<TextbookBot[]>([]);
  const allBots = [...textbookBots, ...customBots];
  const [selectedBotId, setSelectedBotId] = useState(initialBot.id);
  const [messageSerial, setMessageSerial] = useState(1);
  const [teacherMode, setTeacherMode] = useState<TeacherMode>("lesson");
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([createWelcomeMessage(initialBot)]);
  const [chatLoading, setChatLoading] = useState(false);
  const [questionBank, setQuestionBank] = useState<QuestionCluster[]>(initialQuestionClusters);

  const [lessonUnitIds, setLessonUnitIds] = useState<string[]>(initialLessonUnitIds);
  const [lessonFocus, setLessonFocus] = useState(`${initialBot.subject} 수업에서 학생 질문이 많은 개념부터 정리`);
  const [lessonMinutes, setLessonMinutes] = useState(45);
  const [lessonKit, setLessonKit] = useState<LessonKit>(
    buildLessonKit(initialBot, initialLessonUnitIds, initialQuestionClusters, `${initialBot.subject} 수업에서 학생 질문이 많은 개념부터 정리`, 45),
  );

  const [examUnitIds, setExamUnitIds] = useState<string[]>(initialExamUnitIds);
  const [examPurpose, setExamPurpose] = useState("중간고사 1회분");
  const [examQuestionCount, setExamQuestionCount] = useState(3);
  const [examDraft, setExamDraft] = useState<ExamDraft>(
    buildExamDraft(initialBot, initialExamUnitIds, initialQuestionClusters, "중간고사 1회분", 3),
  );

  const currentBot = allBots.find((b) => b.id === selectedBotId) ?? textbookBots[0];
  const currentClusters = sortClusters(questionBank.filter((c) => c.botId === currentBot.id));
  const currentQuestionVolume = currentClusters.reduce((t, c) => t + c.frequency, 0);
  const topClusters = currentClusters.slice(0, 3);
  const currentStudentWeaknesses = initialStudentWeaknesses.filter((sw) => sw.botId === currentBot.id);

  function syncTeacherOutputs(
    bot: TextbookBot,
    nextQB: QuestionCluster[],
    nLessonIds: string[],
    nFocus: string,
    nMin: number,
    nExamIds: string[],
    nPurpose: string,
    nCount: number,
  ) {
    setLessonKit(buildLessonKit(bot, nLessonIds, nextQB, nFocus, nMin));
    setExamDraft(buildExamDraft(bot, nExamIds, nextQB, nPurpose, nCount));
  }

  function handleBotChange(bot: TextbookBot) {
    const nLessonIds = getDefaultLessonUnitIds(bot);
    const nExamIds = getDefaultExamUnitIds(bot);
    const nFocus = `${bot.subject} 수업에서 학생 질문이 많은 개념부터 정리`;
    const nPurpose = "중간고사 1회분";
    const nCount = Math.min(3, nExamIds.length);

    setSelectedBotId(bot.id);
    setChatInput("");
    setChatMessages([createWelcomeMessage(bot)]);
    setLessonUnitIds(nLessonIds);
    setLessonFocus(nFocus);
    setLessonMinutes(45);
    setExamUnitIds(nExamIds);
    setExamPurpose(nPurpose);
    setExamQuestionCount(nCount);
    syncTeacherOutputs(bot, questionBank, nLessonIds, nFocus, 45, nExamIds, nPurpose, nCount);
  }

  function handleSendQuestion() {
    const question = chatInput.trim();
    if (!question || chatLoading) return;

    const userMessage: ChatMessage = { id: `user-${messageSerial}`, role: "user", text: question };
    setChatMessages((c) => [...c, userMessage]);
    setChatInput("");
    setChatLoading(true);

    const history = chatMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, text: m.text }));

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        botId: currentBot.id,
        classId: activeClassId,
        sections: currentBot.sections.map((s) => ({
          title: s.title,
          pages: s.pages,
          summary: s.summary,
          explanation: s.explanation,
          keywords: s.keywords,
          misconceptionTags: s.misconceptionTags,
          citationFocus: s.citationFocus,
        })),
        history,
        botMeta: {
          grade: currentBot.grade,
          subject: currentBot.subject,
          publisher: currentBot.publisher,
          textbookName: currentBot.textbookName,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setChatMessages((c) => [
            ...c,
            { id: `assistant-${messageSerial + 1}`, role: "assistant", text: `오류: ${data.error}` },
          ]);
        } else {
          const evidence: import("@/lib/studio-generation").GroundedEvidence[] = [];
          if (data.evidence) {
            const parts = data.evidence.split("/").map((s: string) => s.trim());
            if (parts.length >= 2) {
              evidence.push({ unitTitle: parts[0], pages: parts[1], reason: `${parts[0]} ${parts[1]}을 근거로 답변했습니다.` });
            } else if (parts[0]) {
              evidence.push({ unitTitle: parts[0], pages: "", reason: `${parts[0]}을 근거로 답변했습니다.` });
            }
          }

          setChatMessages((c) => [
            ...c,
            {
              id: `assistant-${messageSerial + 1}`,
              role: "assistant",
              text: data.answer,
              evidence: evidence.length > 0 ? evidence : undefined,
              followUp: data.followUp || undefined,
              understanding: data.understanding || null,
            },
          ]);

          // Also record into question cluster for teacher view (use fallback)
          const fallbackReply = buildGroundedReply(currentBot, question, messageSerial + 1);
          const nextQB = recordQuestionCluster(questionBank, currentBot, question, fallbackReply);
          setQuestionBank(nextQB);
          syncTeacherOutputs(currentBot, nextQB, lessonUnitIds, lessonFocus, lessonMinutes, examUnitIds, examPurpose, examQuestionCount);
        }
      })
      .catch(() => {
        setChatMessages((c) => [
          ...c,
          { id: `assistant-${messageSerial + 1}`, role: "assistant", text: "AI 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요." },
        ]);
      })
      .finally(() => {
        setChatLoading(false);
        setMessageSerial((c) => c + 2);
      });
  }

  function addCustomBot(bot: TextbookBot) {
    setCustomBots((c) => [...c, bot]);
    handleBotChange(bot);
  }

  function handleLessonGenerate() {
    setLessonKit(buildLessonKit(currentBot, lessonUnitIds, questionBank, lessonFocus, lessonMinutes));
  }

  function handleExamGenerate() {
    setExamDraft(buildExamDraft(currentBot, examUnitIds, questionBank, examPurpose, examQuestionCount));
  }

  return (
    <StudioContext.Provider
      value={{
        allBots, currentBot, handleBotChange, addCustomBot, activeClassId, setActiveClassId,
        chatInput, setChatInput, chatMessages, chatLoading, handleSendQuestion,
        questionBank, currentClusters, currentQuestionVolume, topClusters, currentStudentWeaknesses,
        teacherMode, setTeacherMode,
        lessonUnitIds, setLessonUnitIds, lessonFocus, setLessonFocus, lessonMinutes, setLessonMinutes, lessonKit, handleLessonGenerate,
        examUnitIds, setExamUnitIds, examPurpose, setExamPurpose, examQuestionCount, setExamQuestionCount, examDraft, handleExamGenerate,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}
