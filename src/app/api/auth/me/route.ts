import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, name, role, grade, subject, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      return NextResponse.json({
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          grade: profile.grade ?? null,
          subject: profile.subject ?? null,
          createdAt: profile.created_at,
        },
      });
    }

    // Fallback to metadata
    const meta = user.user_metadata ?? {};
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email ?? "",
        name: (meta.name as string) ?? "",
        role: (meta.role as string) ?? "student",
        grade: (meta.grade as string) ?? null,
        subject: (meta.subject as string) ?? null,
        createdAt: user.created_at ?? new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
