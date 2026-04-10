import { NextRequest, NextResponse } from "next/server";
import {
  createPreviewCookieValue,
  getPreviewCookieExpiresAt,
  hasPreviewKeyConfigured,
  isValidPreviewKey,
  PREVIEW_COOKIE_NAME,
} from "@/lib/landing-preview";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  const logout = request.nextUrl.searchParams.get("logout");
  const landingPreviewPath = "/preview/landing";

  if (logout === "1") {
    const response = NextResponse.redirect(new URL("/preview", request.url));
    response.cookies.delete(PREVIEW_COOKIE_NAME);
    return response;
  }

  if (!hasPreviewKeyConfigured() || !isValidPreviewKey(key)) {
    return NextResponse.redirect(new URL("/preview?error=1", request.url));
  }

  const cookieValue = createPreviewCookieValue();

  if (!cookieValue) {
    return NextResponse.redirect(new URL("/preview?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL(landingPreviewPath, request.url));
  response.cookies.set(PREVIEW_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: getPreviewCookieExpiresAt(),
    sameSite: "lax",
    path: "/",
  });

  return response;
}
