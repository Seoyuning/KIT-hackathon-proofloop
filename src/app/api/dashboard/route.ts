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

  // Aggregate misconceptions and per-section understanding
  const misconceptionMap = new Map<string, number>();
  const sectionMap = new Map<string, { total: number; count: number; questionCount: number }>();

  for (const q of questions ?? []) {
    if (q.misconception) {
      misconceptionMap.set(q.misconception, (misconceptionMap.get(q.misconception) ?? 0) + 1);
    }
    if (q.section_title) {
      const entry = sectionMap.get(q.section_title) ?? { total: 0, count: 0, questionCount: 0 };
      entry.questionCount++;
      if (q.understanding_level) {
        entry.total += q.understanding_level;
        entry.count++;
      }
      sectionMap.set(q.section_title, entry);
    }
  }

  const misconceptionRanking = Array.from(misconceptionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([misconception, count]) => ({ misconception, count }));

  const topMisconception = misconceptionRanking[0]?.misconception ?? "데이터 없음";

  const sectionStats = Array.from(sectionMap.entries())
    .map(([sectionTitle, { total, count, questionCount }]) => ({
      sectionTitle,
      avgUnderstanding: count > 0 ? Math.round((total / count) * 10) / 10 : 0,
      questionCount,
    }))
    .sort((a, b) => b.questionCount - a.questionCount);

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
    misconceptionRanking,
    sectionStats,
    classStats,
  });
}
