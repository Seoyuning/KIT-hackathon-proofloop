import type { CoachPriority, DiagnosisMode, DiagnosisPayload, DiagnosisResult } from "@/lib/types";

const STOPWORDS = new Set([
  "the",
  "and",
  "that",
  "with",
  "from",
  "this",
  "have",
  "what",
  "when",
  "then",
  "into",
  "should",
  "about",
  "there",
  "their",
  "while",
  "where",
  "using",
  "please",
  "code",
  "task",
  "todo",
  "react",
  "api",
  "data",
  "있는",
  "하는",
  "합니다",
  "하고",
  "에서",
  "으로",
  "에게",
  "대한",
  "위한",
  "과제",
  "기능",
  "설명",
  "작성",
  "구현",
  "학생",
  "교강사",
  "학습",
  "코드",
  "프로젝트",
  "한다",
  "해야",
  "필요하다",
  "필요",
  "설명해야",
  "관리해야",
  "있습니다",
  "있다",
  "됩니다",
  "합니다",
  "하는지",
  "어떻게",
  "무엇",
  "전체적",
]);

const DOMAIN_CONCEPTS = [
  "optimistic update",
  "rollback",
  "race condition",
  "requestid",
  "state lifting",
  "상위 컴포넌트",
  "상태",
  "작업 큐",
  "비동기 큐",
  "idempotency",
  "dead-letter queue",
  "retry",
  "worker",
  "human handoff",
  "개인정보",
  "환각",
  "안전장치",
  "메트릭",
];

const REFLECTION_PATTERNS = [
  /because/gi,
  /trade[- ]off/gi,
  /edge case/gi,
  /therefore/gi,
  /root cause/gi,
  /why/gi,
  /이유/gi,
  /왜냐/gi,
  /그래서/gi,
  /가정/gi,
  /비교/gi,
  /근거/gi,
  /문제는/gi,
  /원인은/gi,
];

const TRANSFER_PATTERNS = [
  /if we change/gi,
  /if the/gi,
  /next step/gi,
  /refactor/gi,
  /optimi[sz]e/gi,
  /fallback/gi,
  /rollback/gi,
  /확장/gi,
  /바꾸면/gi,
  /만약/gi,
  /다음 단계/gi,
  /예외/gi,
  /테스트/gi,
  /검증/gi,
];

const DEPENDENCE_PATTERNS = [
  /full code/gi,
  /entire solution/gi,
  /copy and paste/gi,
  /just give me/gi,
  /정답/gi,
  /전체 코드/gi,
  /그대로/gi,
  /복붙/gi,
  /바로 제출/gi,
];

const AGENCY_PATTERNS = [
  /i changed/gi,
  /i tested/gi,
  /i removed/gi,
  /i compared/gi,
  /직접/gi,
  /수정/gi,
  /실험/gi,
  /테스트/gi,
  /확인/gi,
  /분리/gi,
];

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "verdict",
    "evidenceScore",
    "coachPriority",
    "strongestSignal",
    "opportunityWindow",
    "evidenceBreakdown",
    "riskFlags",
    "misconceptions",
    "defenseQuestions",
    "interventionPlan",
    "studentNudge",
    "instructorSummary",
  ],
  properties: {
    verdict: { type: "string" },
    evidenceScore: { type: "number" },
    coachPriority: {
      type: "string",
      enum: ["Immediate", "This week", "Monitor"],
    },
    strongestSignal: { type: "string" },
    opportunityWindow: { type: "string" },
    evidenceBreakdown: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "score", "note"],
        properties: {
          label: { type: "string" },
          score: { type: "number" },
          note: { type: "string" },
        },
      },
    },
    riskFlags: { type: "array", items: { type: "string" } },
    misconceptions: { type: "array", items: { type: "string" } },
    defenseQuestions: { type: "array", items: { type: "string" } },
    interventionPlan: { type: "array", items: { type: "string" } },
    studentNudge: { type: "string" },
    instructorSummary: { type: "string" },
  },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function tokenize(text: string) {
  return Array.from(
    text.toLowerCase().matchAll(/[가-힣a-z][가-힣a-z0-9#+-]{1,}/giu),
    (match) => match[0],
  );
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function extractConcepts(text: string) {
  const lowerText = text.toLowerCase();
  const phraseHits = DOMAIN_CONCEPTS.filter((concept) => lowerText.includes(concept.toLowerCase()));
  const counts = new Map<string, number>();

  for (const token of tokenize(text)) {
    if (STOPWORDS.has(token)) {
      continue;
    }

    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  const tokenConcepts = Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || right[0].length - left[0].length)
    .slice(0, 6)
    .map(([token]) => token);

  return unique([...phraseHits, ...tokenConcepts]).slice(0, 6);
}

function countMatches(text: string, patterns: RegExp[]) {
  return patterns.reduce((total, pattern) => total + (text.match(pattern)?.length ?? 0), 0);
}

function dimensionNote(score: number, dimension: string) {
  if (score >= 80) {
    return `${dimension} evidence is strong enough for the instructor to probe deeper instead of re-teaching the basics.`;
  }

  if (score >= 65) {
    return `${dimension} is visible, but the learner still needs a short verbal or hands-on check before this is considered secure.`;
  }

  return `${dimension} evidence is thin. The current artifact looks finished faster than the reasoning behind it.`;
}

function buildPriority(score: number, independenceScore: number): CoachPriority {
  if (score < 60 || independenceScore < 52) {
    return "Immediate";
  }

  if (score < 78) {
    return "This week";
  }

  return "Monitor";
}

export function heuristicDiagnosis(payload: DiagnosisPayload, mode: DiagnosisMode = "demo_ai"): DiagnosisResult {
  const concepts = extractConcepts(payload.assignmentBrief);
  const submissionTokens = new Set(tokenize(payload.submission));
  const traceText = `${payload.aiTrace}\n${payload.submission}`;
  const matchedConcepts = concepts.filter(
    (concept) =>
      submissionTokens.has(concept) || payload.submission.toLowerCase().includes(concept.toLowerCase()),
  );
  const missingConcepts = concepts.filter((concept) => !matchedConcepts.includes(concept));
  const coverage = concepts.length > 0 ? matchedConcepts.length / concepts.length : 0.5;
  const reflectionHits = countMatches(traceText, REFLECTION_PATTERNS);
  const transferHits = countMatches(traceText, TRANSFER_PATTERNS);
  const dependenceHits = countMatches(payload.aiTrace, DEPENDENCE_PATTERNS);
  const agencyHits = countMatches(traceText, AGENCY_PATTERNS);

  const conceptScore = clamp(38 + coverage * 48 + Math.min(payload.submission.length / 34, 16), 28, 96);
  const transferScore = clamp(35 + transferHits * 10 + Math.min(coverage * 25, 20), 24, 94);
  const reflectionScore = clamp(34 + reflectionHits * 11 + agencyHits * 3, 22, 95);
  const independenceScore = clamp(
    82 - dependenceHits * 13 - Math.min(payload.aiTrace.length / 75, 16) + agencyHits * 2,
    20,
    96,
  );
  const evidenceScore = clamp(
    conceptScore * 0.34 + transferScore * 0.23 + reflectionScore * 0.2 + independenceScore * 0.23,
    26,
    97,
  );

  const evidenceBreakdown = [
    { label: "Concept coverage", score: conceptScore, note: dimensionNote(conceptScore, "Concept coverage") },
    { label: "Transfer ability", score: transferScore, note: dimensionNote(transferScore, "Transfer ability") },
    { label: "Reflection depth", score: reflectionScore, note: dimensionNote(reflectionScore, "Reflection depth") },
    { label: "Independent thinking", score: independenceScore, note: dimensionNote(independenceScore, "Independent thinking") },
  ];

  const riskFlags: string[] = [];

  if (independenceScore < 60) {
    riskFlags.push("AI trace suggests answer-seeking behavior that can hide shallow understanding.");
  }

  if (conceptScore < 62 && missingConcepts.length > 0) {
    riskFlags.push(`The submission never clearly explains core ideas like ${missingConcepts.slice(0, 2).join(", ")}.`);
  }

  if (transferScore < 64) {
    riskFlags.push("The learner can describe what exists, but not how it changes under a new requirement.");
  }

  if (reflectionScore < 60) {
    riskFlags.push("There is not enough evidence of reasoning, trade-offs, or root-cause thinking.");
  }

  if (riskFlags.length === 0) {
    riskFlags.push("No urgent learning-risk signal detected. Keep a light-touch monitor rather than heavy intervention.");
  }

  const misconceptions = unique(
    [
      missingConcepts[0]
        ? `The learner references the output, but not the role of ${missingConcepts[0]} inside the workflow.`
        : "",
      dependenceHits > 0
        ? "The AI prompt history leans toward asking for solutions instead of asking for hints, checks, or alternatives."
        : "",
      transferScore < 68
        ? "The learner has not shown they can adapt the work when the input, failure mode, or requirement changes."
        : "",
      reflectionScore < 63
        ? "The explanation is result-oriented, not reasoning-oriented. 'What it does' is stronger than 'why it works.'"
        : "",
    ].filter(Boolean),
  ).slice(0, 3);

  const focusConcept = missingConcepts[0] ?? matchedConcepts[0] ?? "the main design decision";
  const defenseQuestions = unique(
    [
      `Without opening the code, explain why ${focusConcept} exists and what breaks if you remove it.`,
      `Change one requirement in this assignment. Which part of your solution changes first, and why?`,
      `Point to one line or decision you would undo after testing with a real learner or instructor.`,
    ],
  );

  const interventionPlan = [
    `Run a 3-minute oral defense focused on ${focusConcept} before accepting the assignment as mastered.`,
    "Give one transfer task: change the constraint, data shape, or edge case, and ask the learner to patch it live.",
    dependenceHits > 0
      ? "Switch the learner to a 'hint-first' AI prompt template for the next session and require a reflection note after each AI turn."
      : "Keep AI access open, but require one explicit trade-off note and one self-test step in the next submission.",
  ];

  const strongestSignal =
    evidenceScore >= 80
      ? "The artifact includes enough reasoning and adaptation language to trust the learner's momentum."
      : evidenceScore >= 66
        ? "There is real progress here, but the instructor still needs a targeted probe before declaring mastery."
        : "The deliverable looks ahead of the learner's explanation, which is exactly where hidden learning debt appears.";

  const opportunityWindow =
    evidenceScore >= 80
      ? "Promote this learner into peer-support or mentor mode. Their explanation quality is strong enough to help others."
      : evidenceScore >= 66
        ? "A short teacher intervention now will likely unlock understanding before confusion hardens into false confidence."
        : "This is the moment to intervene. If the learner ships more work without defending it, the gap will compound.";

  const verdict =
    evidenceScore >= 80
      ? "Proof of learning is visible. The next move is stretch work, not remediation."
      : evidenceScore >= 66
        ? "Partial understanding is visible, but the work still needs a focused defense before it counts as true mastery."
        : "The submission is finished, but the evidence of learning is not. Instructor intervention should happen before the learner moves on.";

  const coachPriority = buildPriority(evidenceScore, independenceScore);
  const studentNudge =
    dependenceHits > 0
      ? "다음 AI 요청부터는 '정답' 대신 '내 풀이의 약한 부분 2개만 지적해줘'처럼 질문하세요. 그래야 실력이 남습니다."
      : "좋습니다. 다음 제출에서는 '왜 이 구조를 택했는지'를 한 문장 더 남겨서 이해의 증거를 강화하세요.";

  const instructorSummary = `${payload.studentName || "이 학습자"} is in the ${coachPriority.toLowerCase()} lane. Their strongest gap is ${evidenceBreakdown
    .slice()
    .sort((left, right) => left.score - right.score)[0].label.toLowerCase()}, and the fastest verification path is a short oral defense plus one live transfer edit.`;

  return {
    mode,
    verdict,
    evidenceScore,
    coachPriority,
    strongestSignal,
    opportunityWindow,
    evidenceBreakdown,
    riskFlags,
    misconceptions,
    defenseQuestions,
    interventionPlan,
    studentNudge,
    instructorSummary,
  };
}

function toScore(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? clamp(value, 0, 100) : fallback;
}

function toStringList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function toMode(value: unknown): CoachPriority | null {
  return value === "Immediate" || value === "This week" || value === "Monitor" ? value : null;
}

export function normalizeDiagnosis(raw: unknown, fallback: DiagnosisResult, mode: DiagnosisMode): DiagnosisResult {
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const value = raw as Record<string, unknown>;
  const coachPriority = toMode(value.coachPriority) ?? fallback.coachPriority;
  const evidenceBreakdown = Array.isArray(value.evidenceBreakdown)
    ? value.evidenceBreakdown
        .map((item, index) => {
          if (!item || typeof item !== "object") {
            return fallback.evidenceBreakdown[index];
          }

          const row = item as Record<string, unknown>;

          return {
            label:
              typeof row.label === "string"
                ? row.label
                : fallback.evidenceBreakdown[index]?.label ?? `Metric ${index + 1}`,
            score: toScore(row.score, fallback.evidenceBreakdown[index]?.score ?? 50),
            note:
              typeof row.note === "string"
                ? row.note
                : fallback.evidenceBreakdown[index]?.note ?? "No note available.",
          };
        })
        .slice(0, 4)
    : fallback.evidenceBreakdown;

  return {
    mode,
    verdict: typeof value.verdict === "string" ? value.verdict : fallback.verdict,
    evidenceScore: toScore(value.evidenceScore, fallback.evidenceScore),
    coachPriority,
    strongestSignal:
      typeof value.strongestSignal === "string" ? value.strongestSignal : fallback.strongestSignal,
    opportunityWindow:
      typeof value.opportunityWindow === "string"
        ? value.opportunityWindow
        : fallback.opportunityWindow,
    evidenceBreakdown:
      evidenceBreakdown.length === 4 ? evidenceBreakdown : fallback.evidenceBreakdown,
    riskFlags: toStringList(value.riskFlags, fallback.riskFlags).slice(0, 4),
    misconceptions: toStringList(value.misconceptions, fallback.misconceptions).slice(0, 4),
    defenseQuestions: toStringList(value.defenseQuestions, fallback.defenseQuestions).slice(0, 4),
    interventionPlan: toStringList(value.interventionPlan, fallback.interventionPlan).slice(0, 4),
    studentNudge: typeof value.studentNudge === "string" ? value.studentNudge : fallback.studentNudge,
    instructorSummary:
      typeof value.instructorSummary === "string"
        ? value.instructorSummary
        : fallback.instructorSummary,
  };
}

function extractGeminiText(data: unknown) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const value = data as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const parts = value.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();

  return text.length > 0 ? text : null;
}

export async function analyzeWithOptionalGemini(payload: DiagnosisPayload) {
  const fallback = heuristicDiagnosis(payload, "demo_ai");
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = `You are ProofLoop, an educational reasoning auditor.

Return a balanced diagnosis of whether the learner truly understands the work.
Be specific, practical, and instructor-ready.

Payload:
${JSON.stringify(payload, null, 2)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "You analyze AI-assisted student work and produce instructor-ready JSON only.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: schema,
        },
      }),
    },
    );

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as unknown;
    const outputText = extractGeminiText(data);

    if (!outputText) {
      return fallback;
    }

    const parsed = JSON.parse(outputText);
    return normalizeDiagnosis(parsed, fallback, "live_ai");
  } catch {
    return fallback;
  }
}
