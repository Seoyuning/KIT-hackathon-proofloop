# Changelog

## 0.1.1.4 - 2026-04-07

- Add an 8-second timeout on live Gemini analysis so the app falls back quickly during demos instead of hanging.
- Align `package.json` and `VERSION` so shipped version metadata stays consistent across local, CI, and Vercel logs.

## 0.1.1.3 - 2026-04-07

- Block empty and low-context diagnosis requests on both the client and API route.
- Prevent duplicate diagnosis submissions while a run is already in flight.
- Fall back to deterministic narrative lists when Gemini returns empty arrays or blank strings.
- Replace the misleading initial status message with neutral guidance for beta users.

## 0.1.1.2 - 2026-04-07

- Keep Gemini for live narrative analysis while preserving deterministic scoring and priority metrics.

## 0.1.1.1 - 2026-04-07

- Trim Gemini environment values at runtime so Vercel input whitespace does not break live scoring.

## 0.1.1.0 - 2026-04-07

- Switch the optional live scoring path from OpenAI to Gemini.
- Replace `OPENAI_*` environment variables and docs with `GEMINI_*`.

## 0.1.0.0 - 2026-04-07

- Launch ProofLoop, an AI learning evidence radar for coding education teams.
- Add a polished single-page demo with individual diagnosis, cohort prioritization, and AI strategy sections.
- Add optional Gemini-backed runtime scoring with a demo-safe fallback evaluator.
- Add submission-ready documentation, including product strategy and AI report draft.
