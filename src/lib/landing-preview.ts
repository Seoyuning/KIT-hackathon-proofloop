import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

export const PREVIEW_COOKIE_NAME = "proofloop-landing-preview";

const previewKey = process.env.LANDING_PREVIEW_KEY?.trim();

function toHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function hasPreviewKeyConfigured() {
  return Boolean(previewKey);
}

export function isValidPreviewKey(input: string | null | undefined) {
  if (!previewKey || !input) {
    return false;
  }

  return safeEqual(toHash(input.trim()), toHash(previewKey));
}

export function createPreviewCookieValue() {
  if (!previewKey) {
    return null;
  }

  return toHash(previewKey);
}

export function isAuthorizedPreviewCookie(cookieValue: string | undefined) {
  const expectedValue = createPreviewCookieValue();

  if (!expectedValue || !cookieValue) {
    return false;
  }

  return safeEqual(cookieValue, expectedValue);
}

export function getPreviewCookieExpiresAt() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
}
