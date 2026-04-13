import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  // Build query: all questions for this student
  let query = supabase
    .from("student_questions")
    .select("section_title, understanding_level, misconception")
    .eq("student_id", user.id);

  if (classId) {
    query = query.eq("class_id", classId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[weakness] query error:", error);
    return NextResponse.json({ weakSections: [] });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ weakSections: [] });
  }

  // Group by section_title
  const sectionMap = new Map<string, {
    questionCount: number;
    totalUnderstanding: number;
    understandingCount: number;
    misconceptions: Set<string>;
  }>();

  for (const row of data) {
    const title = row.section_title || "기타";
    let entry = sectionMap.get(title);
    if (!entry) {
      entry = { questionCount: 0, totalUnderstanding: 0, understandingCount: 0, misconceptions: new Set() };
      sectionMap.set(title, entry);
    }
    entry.questionCount++;
    if (row.understanding_level && row.understanding_level > 0) {
      entry.totalUnderstanding += row.understanding_level;
      entry.understandingCount++;
    }
    if (row.misconception) {
      entry.misconceptions.add(row.misconception);
    }
  }

  // Convert to array and sort by lowest avg understanding
  const weakSections = Array.from(sectionMap.entries())
    .map(([sectionTitle, entry]) => ({
      sectionTitle,
      questionCount: entry.questionCount,
      avgUnderstanding: entry.understandingCount > 0
        ? Math.round((entry.totalUnderstanding / entry.understandingCount) * 10) / 10
        : 0,
      misconceptions: Array.from(entry.misconceptions),
    }))
    .sort((a, b) => {
      // Sort by avg understanding ascending (weakest first), then by question count descending
      if (a.avgUnderstanding === 0 && b.avgUnderstanding === 0) return b.questionCount - a.questionCount;
      if (a.avgUnderstanding === 0) return 1;
      if (b.avgUnderstanding === 0) return -1;
      return a.avgUnderstanding - b.avgUnderstanding;
    });

  return NextResponse.json({ weakSections });
}
