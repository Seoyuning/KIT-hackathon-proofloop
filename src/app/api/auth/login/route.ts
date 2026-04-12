import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "이메일과 비밀번호를 입력해 주세요." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email.trim().toLowerCase(),
    password: body.password,
  });

  if (error) {
    let msg = error.message;
    if (/Invalid login credentials/i.test(msg)) msg = "이메일 또는 비밀번호가 올바르지 않습니다.";
    if (/Email not confirmed/i.test(msg)) msg = "이메일 인증이 완료되지 않았습니다.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  // Return user info — the Supabase server client automatically sets session cookies
  const user = data.session?.user;
  const meta = user?.user_metadata ?? {};

  return NextResponse.json({
    ok: true,
    user: {
      id: user?.id,
      email: user?.email,
      name: meta.name ?? "",
      role: meta.role ?? "student",
    },
  });
}
