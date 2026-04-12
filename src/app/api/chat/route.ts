import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ChatRequestBody {
  question: string;
  botId: string;
  /** Textbook sections for grounding */
  sections: Array<{
    title: string;
    pages: string;
    summary: string;
    explanation: string;
    keywords: string[];
    misconceptionTags: string[];
    citationFocus: string;
  }>;
  /** Recent chat history for context */
  history: Array<{ role: "user" | "assistant"; text: string }>;
  botMeta: {
    grade: string;
    subject: string;
    publisher: string;
    textbookName: string;
  };
}

function buildSystemPrompt(body: ChatRequestBody): string {
  const { botMeta, sections } = body;

  const sectionBlock = sections
    .map(
      (s) =>
        `### ${s.title} (${s.pages})\n` +
        `요약: ${s.summary}\n` +
        `설명: ${s.explanation}\n` +
        `핵심어: ${s.keywords.join(", ")}\n` +
        `자주 하는 오개념: ${s.misconceptionTags.join("; ")}\n` +
        `인용 기준: ${s.citationFocus}`
    )
    .join("\n\n");

  return `당신은 ${botMeta.grade} ${botMeta.subject} 교과서 학습 챗봇입니다.
교과서: ${botMeta.publisher} ${botMeta.textbookName}

## 핵심 규칙
1. 반드시 아래 교과서 범위 안에서만 답하세요. 범위를 벗어나는 질문에는 "이 교과서 범위에서는 다루지 않는 내용입니다"라고 답하세요.
2. 답변에는 반드시 관련 단원명과 쪽수를 근거로 포함하세요. 예: "(이차함수의 그래프와 축, 42-47쪽)"
3. 학생이 가질 수 있는 오개념을 미리 짚어주고 올바른 이해로 안내하세요.
4. 답변 마지막에 학생이 이어서 생각해볼 수 있는 후속 질문 1개를 제안하세요. "[후속 질문]" 태그로 시작하세요.
5. 한국어로 답하세요. 친절하지만 간결하게, 교과서 근거에 충실하게 답하세요.

## 교과서 단원 데이터

${sectionBlock}

## 답변 형식
답변 본문을 먼저 쓰고, 맨 마지막 줄에 다음 형식으로 근거를 적어주세요:
[근거] 단원명 / 쪽수
[후속 질문] 이어서 생각해볼 질문`;
}

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const body: ChatRequestBody = await request.json().catch(() => null);
  if (!body?.question || !body?.sections) {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const systemPrompt = buildSystemPrompt(body);

  // Build Gemini contents array from history + new question
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  // Add conversation history (last 10 messages for context)
  const recentHistory = body.history.slice(-10);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    });
  }

  // Add current question
  contents.push({
    role: "user",
    parts: [{ text: body.question }],
  });

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[chat] Gemini error:", res.status, errText);
      return NextResponse.json(
        { error: "AI 응답을 받지 못했습니다." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "답변을 생성하지 못했습니다.";

    // Parse evidence and follow-up from the response
    const lines = text.split("\n");
    let mainAnswer = "";
    let evidenceStr = "";
    let followUp = "";

    for (const line of lines) {
      if (line.startsWith("[근거]")) {
        evidenceStr = line.replace("[근거]", "").trim();
      } else if (line.startsWith("[후속 질문]")) {
        followUp = line.replace("[후속 질문]", "").trim();
      } else {
        mainAnswer += line + "\n";
      }
    }

    return NextResponse.json({
      answer: mainAnswer.trim(),
      evidence: evidenceStr,
      followUp: followUp,
    });
  } catch (err) {
    console.error("[chat] fetch failed:", err);
    return NextResponse.json(
      { error: "AI 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}
