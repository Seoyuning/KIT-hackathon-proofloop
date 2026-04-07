# ProofLoop

ProofLoop is an AI learning evidence radar for coding education teams.

Instead of helping learners finish faster, it helps instructors answer the harder question:

> "Did this learner actually understand the AI-assisted work they just submitted?"

The app reads three inputs together:

- assignment brief
- learner submission or explanation
- AI prompt trace

Then it produces:

- learning evidence score
- risk flags for hidden learning debt
- adaptive defense questions
- instructor intervention plan
- cohort-level coaching priority

## Why this concept fits the hackathon

The competition asks for an AI solution that solves real education pain, not another LMS.

ProofLoop targets a new pain point created by AI-native learning environments:

- learners can now ship assignments with AI support faster than ever
- instructors have less visibility into whether real understanding exists
- operators discover weak understanding too late, after confidence drops or attrition starts

This makes ProofLoop practical, current, and differentiated from generic tutors or grading assistants.

## Product structure

### 1. Diagnosis Studio

Input one learner case and generate:

- concept coverage score
- transfer ability score
- reflection depth score
- independent thinking score
- coach priority

### 2. Instructor Radar

Review a cohort sorted by intervention priority rather than by raw completion status.

### 3. AI strategy layer

The MVP includes two execution modes:

- `Demo AI` fallback: deterministic evaluator that always works in public demos and without secrets
- `Live AI` mode: optional runtime scoring through the Gemini API when `GEMINI_API_KEY` is configured

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Optional Gemini runtime integration via `src/app/api/diagnose/route.ts`

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` if you want live model scoring:

```bash
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

If the API key is missing or the model call fails, the app automatically falls back to the built-in demo evaluator.

## Deploy

The easiest path is Vercel.

1. Import the repository.
2. Set `GEMINI_API_KEY` only if you want live model scoring.
3. Deploy.

The app still works without secrets, which is useful for public judging and safe GitHub sharing.

## Submission support docs

- [Product strategy](./docs/proofloop-design.md)
- [AI report final draft](./docs/AI_REPORT_DRAFT.md)
- [90-second demo script](./docs/DEMO_SCRIPT.md)
- [Submission checklist](./docs/SUBMISSION_CHECKLIST.md)

## Verification

The current build passes:

```bash
npm run lint
npm run build
```
