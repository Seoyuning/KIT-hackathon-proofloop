# ProofLoop

ProofLoop is an education AI prototype for public education and academy-style classrooms.

The project currently has two surfaces:

- `/studio` : the public working application for students and teachers
- `/` : a private landing preview, hidden unless a preview cookie is present
- `/preview` : the internal access page for unlocking the private landing preview

## Current Product Shape

The active product direction is the `/studio` workspace.

It models the workflow shown in the recent design iteration:

1. Students use a textbook-grounded chatbot by subject and publisher.
2. The chatbot answers only from the selected textbook scope and returns unit/page evidence.
3. Student questions are accumulated into an integrated question database.
4. Teachers use that question database to generate lesson-material drafts and exam drafts.

This makes the student-facing AI and the teacher-facing AI share the same source of instructional signals.

## `/studio` Features

- Textbook bot selector by school level, subject, and publisher
- Grounded student chat flow with section/page evidence
- Integrated question DB that clusters repeated student questions and misconceptions
- Teacher lesson-kit generator from selected units + question DB
- Teacher exam-draft generator from selected scope + predicted misconception traps
- App-style dashboard layout intended for real usage rather than a marketing-only page

## Demo Data Included

The current seeded workspace includes textbook bots and unit data for:

- High school math
- Middle school science
- High school Korean

All of this data currently lives in local source files and is used to simulate the MVP flow.

## Project Structure

- `src/app/page.tsx`
  - landing page and product positioning
- `src/app/studio/page.tsx`
  - entry route for the actual application workspace
- `src/components/studio-workbench.tsx`
  - main app shell and dashboard workflow
- `src/components/studio-ui.tsx`
  - reusable studio UI components
- `src/lib/studio-data.ts`
  - seeded textbook bots, textbook sections, and initial question clusters
- `src/lib/studio-generation.ts`
  - grounded reply generation, question clustering, lesson-kit generation, exam-draft generation
- `src/app/api/diagnose/route.ts`
  - legacy diagnosis API from the earlier prototype flow

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Private Root Preview

The root landing page is intentionally hidden from public traffic.

- Public users should enter through `/studio`
- The root `/` returns the hidden landing only after the preview key is verified
- Configure `LANDING_PREVIEW_KEY` in your environment
- Visit `/preview`, submit the key, and the app will set a secure preview cookie for `/`
- Visit `/api/preview?logout=1` to clear the preview cookie

## Local Development

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/studio`
- `http://localhost:3000/preview`
- `http://localhost:3000` after the preview cookie is unlocked

## Verification

```bash
npm run lint
npm run build
```

Both commands were used during the recent workspace updates.

## Current Limitations

- Textbook grounding is currently simulated with seeded local data, not uploaded PDFs
- The integrated question DB is currently an in-memory/local-source MVP, not a real database
- Teacher outputs are generated from deterministic local logic, not a live production AI pipeline

## Recommended Next Steps

- Add textbook PDF upload and parsing flow
- Persist question clusters in a real database
- Connect grounded retrieval / LLM generation for textbook answers
- Add teacher export flows for PPT, worksheet, and exam formats
