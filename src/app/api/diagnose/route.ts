import { NextResponse } from "next/server";
import { analyzeWithOptionalOpenAI } from "@/lib/diagnosis";
import type { DiagnosisPayload } from "@/lib/types";

function isPayload(value: unknown): value is DiagnosisPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.studentName === "string" &&
    typeof payload.assignmentTitle === "string" &&
    typeof payload.assignmentBrief === "string" &&
    typeof payload.submission === "string" &&
    typeof payload.aiTrace === "string"
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isPayload(body)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const diagnosis = await analyzeWithOptionalOpenAI(body);
  return NextResponse.json(diagnosis);
}
