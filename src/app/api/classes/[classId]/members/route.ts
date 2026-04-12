import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: list students in a class with their question stats
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  // Get class members with profile info
  const { data: members, error: memErr } = await supabase
    .from("class_members")
    .select("student_id, joined_at, profiles:student_id(name, email)")
    .eq("class_id", classId);

  if (memErr) return NextResponse.json({ error: memErr.message }, { status: 500 });

  // Get question stats per student
  const { data: questions } = await supabase
    .from("student_questions")
    .select("student_id, question, section_title, misconception, created_at")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  // Group questions by student
  const studentMap = new Map<string, {
    studentId: string;
    name: string;
    email: string;
    joinedAt: string;
    questionCount: number;
    weakConcepts: Array<{ sectionTitle: string; misconception: string; count: number; lastQuestion: string }>;
  }>();

  for (const member of members ?? []) {
    const profile = member.profiles as any;
    studentMap.set(member.student_id, {
      studentId: member.student_id,
      name: profile?.name ?? "이름 없음",
      email: profile?.email ?? "",
      joinedAt: member.joined_at,
      questionCount: 0,
      weakConcepts: [],
    });
  }

  // Aggregate questions into weak concepts
  for (const q of questions ?? []) {
    const student = studentMap.get(q.student_id);
    if (!student) continue;
    student.questionCount++;

    if (q.misconception) {
      const existing = student.weakConcepts.find(
        (wc) => wc.misconception === q.misconception && wc.sectionTitle === (q.section_title ?? "")
      );
      if (existing) {
        existing.count++;
      } else {
        student.weakConcepts.push({
          sectionTitle: q.section_title ?? "단원 미지정",
          misconception: q.misconception,
          count: 1,
          lastQuestion: q.question,
        });
      }
    }
  }

  return NextResponse.json({
    members: Array.from(studentMap.values()),
    totalMembers: members?.length ?? 0,
  });
}
