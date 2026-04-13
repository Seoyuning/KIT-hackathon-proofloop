import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.name || !body?.role) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해 주세요." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const name = body.name.trim();
  const role = body.role;
  const grade = body.grade?.trim() || null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
  }
  if (body.password.length < 6) {
    return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? "";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: body.password,
    options: {
      data: { name, role, grade },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    let msg = error.message;
    if (/User already registered/i.test(msg)) msg = "이미 가입된 이메일입니다.";
    if (/Password should be at least/i.test(msg)) msg = "비밀번호는 6자 이상이어야 합니다.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const needsEmailConfirm = !data.session;
  return NextResponse.json({ ok: true, needsEmailConfirm });
}
