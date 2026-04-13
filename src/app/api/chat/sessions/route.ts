import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: list sessions for current user + classId
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ sessions: [] });

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  if (!classId) return NextResponse.json({ sessions: [] });

  const { data } = await supabase
    .from("chat_sessions")
    .select("id, class_id, student_id, title, created_at")
    .eq("class_id", classId)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ sessions: data ?? [] });
}

// POST: create a new session
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.classId) {
    return NextResponse.json({ error: "classId가 필요합니다." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      class_id: body.classId,
      student_id: user.id,
      title: body.title ?? "새 대화",
    })
    .select("id, class_id, student_id, title, created_at")
    .single();

  if (error) {
    console.error("[sessions] insert error:", error);
    return NextResponse.json({ error: "세션을 생성할 수 없습니다." }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
