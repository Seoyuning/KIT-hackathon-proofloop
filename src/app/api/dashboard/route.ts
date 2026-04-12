import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET: teacher dashboard stats across all their classes
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  // Get all classes for this teacher
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .eq("teacher_id", user.id);

  if (!classes || classes.length === 0) {
    return NextResponse.json({
      totalQuestions: 0,
      totalStudents: 0,
      topMisconception: "데이터 없음",
      avgUnderstanding: 0,
      misconceptionRanking: [],
      classStats: [],
    });
  }

  const classIds = classes.map((c) => c.id);

  // Count total students across all classes
  const { count: totalStudents } = await supabase
    .from("class_members")
    .select("id", { count: "exact", head: true })
    .in("class_id", classIds);

  // Get all questions across all classes
  const { data: questions } = await supabase
    .from("student_questions")
    .select("question, section_title, misconception, understanding_level, class_id")
    .in("class_id", classIds);

  const totalQuestions = questions?.length ?? 0;

  // Aggregate misconceptions
  const misconceptionMap = new Map<string, number>();
  let totalUnderstanding = 0;
  let understandingCount = 0;

  for (const q of questions ?? []) {
    if (q.misconception) {
      misconceptionMap.set(q.misconception, (misconceptionMap.get(q.misconception) ?? 0) + 1);
    }
    if (q.understanding_level) {
      totalUnderstanding += q.understanding_level;
      understandingCount++;
    }
  }

  const misconceptionRanking = Array.from(misconceptionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([misconception, count]) => ({ misconception, count }));

  const topMisconception = misconceptionRanking[0]?.misconception ?? "데이터 없음";
  const avgUnderstanding = understandingCount > 0 ? Math.round((totalUnderstanding / understandingCount) * 10) / 10 : 0;

  // Per-class stats
  const classStats = classes.map((cls) => {
    const classQuestions = (questions ?? []).filter((q) => q.class_id === cls.id);
    return {
      classId: cls.id,
      className: cls.name,
      questionCount: classQuestions.length,
    };
  });

  return NextResponse.json({
    totalQuestions,
    totalStudents: totalStudents ?? 0,
    topMisconception,
    avgUnderstanding,
    misconceptionRanking,
    classStats,
  });
}
