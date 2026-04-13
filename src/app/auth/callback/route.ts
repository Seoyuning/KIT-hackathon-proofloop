import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/studio";

  // Prevent open redirect — only allow relative paths starting with /studio
  const safeDest = next.startsWith("/studio") && !next.includes("//") ? next : "/studio";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeDest}`);
    }
  }

  return NextResponse.redirect(`${origin}/studio/login?error=auth_callback`);
}
