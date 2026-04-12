import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: student joins a class with invite code
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const code = body?.inviteCode?.trim()?.toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "초대 코드를 입력해 주세요." }, { status: 400 });
  }

  // Find class by invite code
  const { data: cls, error: clsErr } = await supabase
    .from("classes")
    .select("id, name, max_students")
    .eq("invite_code", code)
    .maybeSingle();

  if (clsErr || !cls) {
    return NextResponse.json({ error: "유효하지 않은 초대 코드입니다." }, { status: 404 });
  }

  // Check if already joined
  const { data: existing } = await supabase
    .from("class_members")
    .select("id")
    .eq("class_id", cls.id)
    .eq("student_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "이미 참여 중인 반입니다.", class: cls });
  }

  // Check member count
  const { count } = await supabase
    .from("class_members")
    .select("id", { count: "exact", head: true })
    .eq("class_id", cls.id);

  if ((count ?? 0) >= cls.max_students) {
    return NextResponse.json({ error: `이 반은 최대 ${cls.max_students}명까지 참여할 수 있습니다.` }, { status: 400 });
  }

  // Join
  const { error: joinErr } = await supabase
    .from("class_members")
    .insert({ class_id: cls.id, student_id: user.id });

  if (joinErr) {
    return NextResponse.json({ error: joinErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, class: cls });
}
