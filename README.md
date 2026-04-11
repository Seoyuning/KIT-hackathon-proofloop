# ProofLoop

ProofLoop is an education AI prototype for public education and academy-style classrooms.

The project currently has these surfaces:

- `/` : public landing / product-positioning page
- `/studio/login` : email + password login / signup with role selection (student or teacher)
- `/studio` : auto-redirect based on auth state (login → chat or analysis)
- `/studio/chat` : student-only textbook chatbot
- `/studio/analysis` : teacher-only question DB and textbook range analysis
- `/studio/generate` : teacher-only lesson material and exam draft generation

## Current Product Shape

The active product direction is the `/studio` workspace.

Positioning: ProofLoop is a personalized learning loop. Each student works with a textbook-grounded AI to surface and close the gaps they personally struggle with, while teachers receive the aggregated view of both per-student weaknesses and the concepts the whole class finds hard.

It models the workflow shown in the recent design iteration:

1. Students use a textbook-grounded chatbot by subject and publisher to study at their own pace.
2. The chatbot answers only from the selected textbook scope, returns unit/page evidence, and helps each student identify their own weak concepts.
3. Student questions and interactions are accumulated into an integrated question database.
4. Teachers use that database to see each student's individual weak points and the topics the class is commonly stuck on, and to generate lesson-material drafts and exam drafts aligned to those signals.

Student-facing AI and teacher-facing AI share the same source of instructional signals, so per-student personalization and whole-class insight are two views of one data loop.

## `/studio` Features

- Email + password authentication with role selection at signup
- Role-based page access: students and teachers see completely separate pages
- Textbook bot selector by school level, subject, and publisher
- **Student** (`/studio/chat`): Grounded chat with section/page evidence
- **Teacher** (`/studio/analysis`): Question DB clusters + textbook range overview
- **Teacher** (`/studio/generate`): Lesson-kit and exam-draft generation from question data
- Shared state: student questions automatically feed teacher tools via React Context
- Sidebar with user info, logout, and role-specific navigation

## Demo Data Included

The current seeded workspace includes textbook bots and unit data for:

- High school math
- Middle school science
- High school Korean

All of this data currently lives in local source files and is used to simulate the MVP flow.

## Project Structure

- `src/app/page.tsx`
  - public landing page (product positioning, CTAs to `/studio/login`)
- `src/app/studio/layout.tsx`
  - studio shell with role-aware sidebar and navigation
- `src/app/studio/login/page.tsx`
  - login and signup page with email/password and role selection
- `src/app/studio/page.tsx`
  - auth-based redirect (login → chat or analysis)
- `src/app/studio/chat/page.tsx`
  - student-only textbook chatbot page
- `src/app/studio/analysis/page.tsx`
  - teacher-only question DB and textbook range analysis
- `src/app/studio/generate/page.tsx`
  - teacher-only lesson material and exam draft generation
- `src/lib/auth-context.tsx`
  - authentication provider (email/password, role persistence via localStorage)
- `src/lib/studio-context.tsx`
  - shared React Context for bot, chat, question DB, and teacher state
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

## Local Development

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000` -> public landing page
- `http://localhost:3000/studio/login`
- `http://localhost:3000/studio`

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

- Add SNS OAuth login (Kakao, Google) alongside email/password
- Migrate auth from localStorage to server-side sessions / database
- Add textbook PDF upload and parsing flow
- Persist question clusters in a real database
- Connect grounded retrieval / LLM generation for textbook answers
- Add teacher export flows for PPT, worksheet, and exam formats
