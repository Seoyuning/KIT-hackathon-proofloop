import type { Metadata } from "next";
import Link from "next/link";
import { hasPreviewKeyConfigured } from "@/lib/landing-preview";

type PreviewPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "Landing Preview Access",
  description: "Internal access page for the ProofLoop landing preview.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewAccessPage({ searchParams }: PreviewPageProps) {
  const query = await searchParams;
  const hasError = Boolean(query.error);
  const previewEnabled = hasPreviewKeyConfigured();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f1_0%,#f8f3ec_50%,#eef3f9_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center">
        <section className="paper-panel w-full rounded-[32px] border border-line/80 px-6 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10">
          <div className="inline-flex rounded-full border border-line bg-white/70 px-4 py-2 text-xs font-medium text-muted">
            Internal Preview
          </div>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div>
                <h1 className="display-title text-4xl leading-[0.96] text-navy sm:text-5xl">
                  Main domain now opens the studio.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                  Public traffic can enter from the main domain because <span className="font-semibold text-navy">`/`</span>
                  now redirects to <span className="font-semibold text-navy">`/studio`</span>. The hidden landing page stays
                  on a separate internal preview route until the official website launch.
                </p>
              </div>

              <div className="rounded-[24px] border border-line bg-white/75 p-5">
                <p className="text-sm font-semibold text-navy">Current behavior</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  <li>Main domain `/`: permanent redirect to `/studio`</li>
                  <li>Public service URL: `/studio`</li>
                  <li>Hidden landing route: `/preview/landing` after preview unlock</li>
                  <li>Logout preview access: `/api/preview?logout=1`</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                  href="/studio"
                >
                  Go To Studio
                </Link>
                <a
                  className="pill rounded-full px-5 py-3 text-sm font-semibold text-foreground transition-transform duration-200 hover:-translate-y-0.5"
                  href="/api/preview?logout=1"
                >
                  Clear Preview Cookie
                </a>
              </div>
            </div>

            <div className="rounded-[28px] border border-navy/10 bg-navy px-5 py-5 text-white sm:px-6">
              <p className="eyebrow text-xs text-white/70">Preview Key</p>
              <h2 className="mt-4 text-2xl font-semibold leading-tight">Open the hidden landing preview.</h2>

              <form action="/api/preview" className="mt-6 space-y-4" method="get">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/86">Access key</span>
                  <input
                    className="w-full rounded-2xl border border-white/14 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/35"
                    name="key"
                    placeholder="Enter LANDING_PREVIEW_KEY"
                    type="password"
                  />
                </label>

                {hasError ? (
                  <p className="rounded-2xl border border-[#ffb4a2]/40 bg-[#ffb4a2]/10 px-4 py-3 text-sm text-[#ffe1d9]">
                    The preview key did not match. Check the deployed environment variable and try again.
                  </p>
                ) : null}

                {!previewEnabled ? (
                  <p className="rounded-2xl border border-[#ffd166]/40 bg-[#ffd166]/10 px-4 py-3 text-sm text-[#ffeab0]">
                    `LANDING_PREVIEW_KEY` is not configured in this environment yet, so the hidden landing preview
                    route will stay locked for everyone.
                  </p>
                ) : null}

                <button
                  className="w-full rounded-2xl bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                  type="submit"
                >
                  Unlock Root Landing
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
