import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface ChatRequestBody {
  question: string;
  botId: string;
  classId?: string;
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

  return `당신은 ${botMeta.grade} ${botMeta.subject} 교과서 학습 챗봇이자 학습 코치입니다.
교과서: ${botMeta.publisher} ${botMeta.textbookName}

## 핵심 규칙
1. 반드시 아래 교과서 범위 안에서만 답하세요. 범위를 벗어나는 질문에는 "이 교과서 범위에서는 다루지 않는 내용입니다"라고 답하세요.
2. 답변에는 반드시 관련 단원명과 쪽수를 근거로 포함하세요. 예: "(이차함수의 그래프와 축, 42-47쪽)"
3. 학생이 가질 수 있는 오개념을 미리 짚어주고 올바른 이해로 안내하세요.
4. 한국어로 답하세요. 친절하지만 간결하게, 교과서 근거에 충실하게 답하세요.

## 과제 대행 감지 & 학습 유도
- 학생이 "이 문제 풀어줘", "과제 해줘", "답 알려줘" 등 **답을 직접 요구**하면 바로 답을 주지 마세요.
- 대신 "스스로 풀 수 있도록 도와줄게요"라고 하고, 핵심 개념을 설명한 뒤 **서술형 확인 질문**을 1개 내세요.
- 서술형 질문은 찍어서 맞출 수 없는 형태여야 합니다. 예: "~를 자신의 말로 설명해 보세요", "~가 왜 그런지 이유를 써 보세요".
- 학생이 서술형 질문에 답하면 그 답변을 분석해 이해 수준을 평가하세요.

## 이해도 평가
매 답변에서 학생의 이해 수준을 아래 5단계로 판단하세요:
- 1단계(매우 부족): 개념을 전혀 모르거나 완전히 틀린 이해
- 2단계(부족): 개념의 일부만 알고 핵심을 놓침
- 3단계(보통): 기본 개념은 알지만 응용이나 연결이 약함
- 4단계(양호): 개념을 정확히 이해하고 간단한 응용 가능
- 5단계(우수): 개념을 자기 말로 설명하고 다른 개념과 연결 가능

## 교과서 단원 데이터

${sectionBlock}

## 답변 형식
답변 본문을 먼저 쓰고, 맨 마지막에 다음 태그들을 각각 한 줄에 적어주세요:
[근거] 단원명 / 쪽수
[이해도] 1~5 (숫자만)
[후속 질문] 이어서 생각해볼 서술형 질문`;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    // Parse evidence, understanding level, and follow-up from the response
    const lines = text.split("\n");
    let mainAnswer = "";
    let evidenceStr = "";
    let followUp = "";
    let understanding = 0;

    for (const line of lines) {
      if (line.startsWith("[근거]")) {
        evidenceStr = line.replace("[근거]", "").trim();
      } else if (line.startsWith("[이해도]")) {
        understanding = parseInt(line.replace("[이해도]", "").trim(), 10) || 0;
      } else if (line.startsWith("[후속 질문]")) {
        followUp = line.replace("[후속 질문]", "").trim();
      } else {
        mainAnswer += line + "\n";
      }
    }

    // Save question to DB if student is in a class
    if (body.classId) {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Find which section the question relates to
          const evidenceParts = evidenceStr.split("/").map((s: string) => s.trim());
          const sectionTitle = evidenceParts[0] || null;

          // Find misconception from the matched section
          let misconception: string | null = null;
          if (sectionTitle) {
            const matchedSection = body.sections.find((s) =>
              sectionTitle.includes(s.title) || s.title.includes(sectionTitle)
            );
            if (matchedSection) {
              misconception = matchedSection.misconceptionTags[0] ?? null;
            }
          }

          await supabase.from("student_questions").insert({
            class_id: body.classId,
            student_id: user.id,
            question: body.question,
            section_title: sectionTitle,
            misconception,
            understanding_level: understanding || null,
          });
        }
      } catch (e) {
        console.error("[chat] failed to save question:", e);
      }
    }

    return NextResponse.json({
      answer: mainAnswer.trim(),
      evidence: evidenceStr,
      followUp: followUp,
      understanding: understanding || null,
    });
  } catch (err) {
    console.error("[chat] fetch failed:", err);
    return NextResponse.json(
      { error: "AI 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}
