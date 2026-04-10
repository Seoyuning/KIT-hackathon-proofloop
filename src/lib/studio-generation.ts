import type { QuestionCluster, TextbookBot, TextbookSection } from "@/lib/studio-data";

export type GroundedEvidence = {
  unitTitle: string;
  pages: string;
  reason: string;
};

export type GroundedReply = {
  messageId: string;
  answer: string;
  evidence: GroundedEvidence[];
  followUp: string;
  sectionId: string | null;
  sectionTitle: string | null;
  misconception: string;
  studentNeed: string;
  teacherAction: string;
};

export type LessonKit = {
  title: string;
  summary: string;
  questionSignals: QuestionCluster[];
  slideOutline: Array<{ title: string; bullets: string[] }>;
  checkQuestions: string[];
  teacherMemo: string[];
};

export type ExamDraft = {
  title: string;
  summary: string;
  predictedTraps: string[];
  questions: Array<{
    number: number;
    stem: string;
    options: string[];
    answer: string;
    rationale: string;
    source: string;
  }>;
  reviewNotes: string[];
};

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function formatUnitList(sections: TextbookSection[]) {
  return sections.map((section) => section.title).join(", ");
}

function scoreSection(section: TextbookSection, question: string) {
  const normalizedQuestion = normalize(question);
  let score = 0;

  for (const keyword of section.keywords) {
    if (normalizedQuestion.includes(normalize(keyword))) {
      score += 3;
    }
  }

  if (normalizedQuestion.includes(normalize(section.title))) {
    score += 4;
  }

  for (const tag of section.misconceptionTags) {
    const slice = normalize(tag).slice(0, 8);

    if (slice.length > 0 && normalizedQuestion.includes(slice)) {
      score += 1;
    }
  }

  return score;
}

function findRelevantSections(bot: TextbookBot, question: string) {
  return bot.sections
    .map((section) => ({ section, score: scoreSection(section, question) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 2)
    .map((item) => item.section);
}

function rotateOptions(answer: string, distractors: [string, string, string], offset: number) {
  const options = [answer, ...distractors];
  const pivot = offset % options.length;

  return options.slice(pivot).concat(options.slice(0, pivot));
}

export function buildGroundedReply(bot: TextbookBot, question: string, serial: number): GroundedReply {
  const relevantSections = findRelevantSections(bot, question);
  const primary = relevantSections[0];
  const secondary = relevantSections[1];

  if (!primary) {
    return {
      messageId: `assistant-${serial}`,
      answer:
        "현재 선택한 교과서 범위에서 직접 근거를 찾지 못했습니다. 단원명이나 핵심 개념을 포함해 다시 질문하면 교과서 쪽수와 함께 더 정확히 답할 수 있습니다.",
      evidence: [],
      followUp: bot.starterPrompts[0],
      sectionId: null,
      sectionTitle: null,
      misconception: "질문이 교과서 단원 범위와 충분히 연결되지 않음",
      studentNeed: "질문을 단원명이나 핵심어와 함께 다시 구성할 필요가 있습니다.",
      teacherAction: "학생이 질문을 단원 기준으로 좁혀 말하도록 질문 템플릿을 제공합니다.",
    };
  }

  const normalizedQuestion = normalize(question);
  const answerTone =
    normalizedQuestion.includes("왜") || normalizedQuestion.includes("이유")
      ? `질문의 이유를 교과서 기준으로 정리하면 ${primary.explanation}`
      : normalizedQuestion.includes("비교")
        ? `교과서에서는 ${primary.summary}를 기준으로 상황을 비교합니다. ${primary.explanation}`
        : `${primary.summary} ${primary.explanation}`;

  const connection = secondary
    ? ` 함께 보면 ${secondary.title}(${secondary.pages})도 연결되어 같은 기준을 확장해서 이해할 수 있습니다.`
    : "";

  return {
    messageId: `assistant-${serial}`,
    answer: `${primary.title} 단원 기준으로 답하면, ${answerTone}${connection}`,
    evidence: relevantSections.map((section) => ({
      unitTitle: section.title,
      pages: section.pages,
      reason: `${section.pages}쪽의 ${section.citationFocus}를 근거로 답변했습니다.`,
    })),
    followUp: primary.questionSeeds[0],
    sectionId: primary.id,
    sectionTitle: primary.title,
    misconception: primary.misconceptionTags[0],
    studentNeed: `학생은 ${primary.misconceptionTags[0]} 지점에서 자주 멈춥니다.`,
    teacherAction: primary.teacherBridge,
  };
}

export function recordQuestionCluster(
  current: QuestionCluster[],
  bot: TextbookBot,
  question: string,
  reply: GroundedReply,
) {
  if (!reply.sectionId) {
    return current;
  }

  const existingIndex = current.findIndex(
    (cluster) =>
      cluster.botId === bot.id &&
      cluster.sectionId === reply.sectionId &&
      cluster.misconception === reply.misconception,
  );

  if (existingIndex >= 0) {
    return current.map((cluster, index) =>
      index === existingIndex
        ? {
            ...cluster,
            frequency: cluster.frequency + 1,
            representativeQuestion:
              question.length < cluster.representativeQuestion.length ? question : cluster.representativeQuestion,
            studentNeed: reply.studentNeed,
            teacherAction: reply.teacherAction,
          }
        : cluster,
    );
  }

  return [
    {
      id: `${bot.id}-${reply.sectionId}-${current.length + 1}`,
      botId: bot.id,
      sectionId: reply.sectionId,
      representativeQuestion: question,
      misconception: reply.misconception,
      frequency: 1,
      studentNeed: reply.studentNeed,
      teacherAction: reply.teacherAction,
    },
    ...current,
  ];
}

export function buildLessonKit(
  bot: TextbookBot,
  selectedSectionIds: string[],
  questionBank: QuestionCluster[],
  teachingFocus: string,
  minutes: number,
): LessonKit {
  const selectedSections = bot.sections.filter((section) => selectedSectionIds.includes(section.id));
  const sections = selectedSections.length > 0 ? selectedSections : bot.sections.slice(0, 2);
  const relevantSignals = questionBank
    .filter((cluster) => cluster.botId === bot.id && sections.some((section) => section.id === cluster.sectionId))
    .sort((left, right) => right.frequency - left.frequency)
    .slice(0, 4);

  const summaryFocus = teachingFocus.trim().length > 0 ? teachingFocus.trim() : `${formatUnitList(sections)} 핵심 개념 정리`;

  return {
    title: `${bot.grade} ${bot.subject} 수업 자료 초안`,
    summary: `${summaryFocus}를 목표로 하고, 통합 질문 DB의 빈출 질문 ${relevantSignals.length}개를 반영한 ${minutes}분 수업안입니다.`,
    questionSignals: relevantSignals,
    slideOutline: [
      {
        title: "1. 수업 도입: 학생이 실제로 많이 한 질문",
        bullets:
          relevantSignals.length > 0
            ? relevantSignals.map(
                (signal) => `${signal.representativeQuestion} (${signal.frequency}회) -> ${signal.misconception}`,
              )
            : sections.map((section) => `${section.title}: ${section.questionSeeds[0]}`),
      },
      {
        title: "2. 교과서 핵심 개념 정리",
        bullets: sections.map((section) => `${section.title}: ${section.summary}`),
      },
      {
        title: "3. 오개념 교정 포인트",
        bullets: sections.map((section) => `${section.misconceptionTags[0]} -> ${section.teacherBridge}`),
      },
      {
        title: "4. 학생 참여 활동",
        bullets: sections.map((section) => `${section.questionSeeds[0]}를 짝 토론 또는 미니 보드로 확인`),
      },
      {
        title: "5. 수업 종료 전 1분 점검",
        bullets: sections.map(
          (section) => `${section.title} 내용을 교과서 근거와 함께 한 문장으로 설명하게 하기`,
        ),
      },
    ],
    checkQuestions:
      relevantSignals.length > 0
        ? relevantSignals.map(
            (signal) => `${signal.representativeQuestion}에 답할 때 교과서에서 어떤 근거를 먼저 찾아야 하나요?`,
          )
        : sections.map((section) => section.questionSeeds[0]),
    teacherMemo: [
      `수업 범위: ${formatUnitList(sections)}`,
      `총 ${minutes}분 기준으로 도입 8분 / 개념 정리 15분 / 오개념 교정 12분 / 확인 10분으로 구성`,
      "강의 자료 첫 장에 질문 DB 상위 질문을 그대로 넣어 학생의 체감 난점을 먼저 보여 주기",
      "모든 설명은 교과서 쪽수와 그림 또는 표를 함께 언급하도록 구성하기",
    ],
  };
}

export function buildExamDraft(
  bot: TextbookBot,
  selectedSectionIds: string[],
  questionBank: QuestionCluster[],
  examPurpose: string,
  questionCount: number,
): ExamDraft {
  const selectedSections = bot.sections.filter((section) => selectedSectionIds.includes(section.id));
  const sections = selectedSections.length > 0 ? selectedSections : bot.sections.slice(0, 2);
  const scopeSections = sections.slice(0, Math.max(1, Math.min(questionCount, sections.length)));
  const relevantSignals = questionBank
    .filter((cluster) => cluster.botId === bot.id && scopeSections.some((section) => section.id === cluster.sectionId))
    .sort((left, right) => right.frequency - left.frequency);

  const predictedTraps = unique(
    [...relevantSignals.map((signal) => signal.misconception), ...scopeSections.map((section) => section.misconceptionTags[0])].slice(
      0,
      4,
    ),
  );

  return {
    title: `${bot.grade} ${bot.subject} ${examPurpose.trim().length > 0 ? examPurpose.trim() : "시험지"} 초안`,
    summary: `${formatUnitList(scopeSections)} 범위를 기준으로 통합 질문 DB의 빈출 오개념을 반영한 문제 초안입니다.`,
    predictedTraps,
    questions: scopeSections.map((section, index) => ({
      number: index + 1,
      stem: section.examStem,
      options: rotateOptions(section.examAnswer, section.examDistractors, index),
      answer: section.examAnswer,
      rationale: `질문 DB에서 "${section.misconceptionTags[0]}" 유형이 자주 나타나므로, 오답 선택지도 그 오개념을 기준으로 설계했습니다.`,
      source: `${section.title} / ${section.pages}`,
    })),
    reviewNotes: [
      "채점 후 오답 문항을 오개념 태그별로 다시 묶어 다음 보충 수업 자료에 그대로 반영하기",
      "정답률보다 어떤 오답 선택지가 반복되는지 먼저 확인해 질문 DB와 연결하기",
      "문항 해설에도 교과서 쪽수와 그림 또는 표를 함께 명시하기",
    ],
  };
}
