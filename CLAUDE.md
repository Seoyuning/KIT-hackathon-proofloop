@AGENTS.md

# Project Notes

## Active Surface

- `/studio` is the primary end-user application surface.
- `/` should remain the landing / product-positioning page.
- Do not turn `/studio` back into a marketing-style hero page.

## Current Product Model

The `/studio` route requires email+password authentication with role-based access:

- `/studio/login` — login / signup (email, password, name, role selection)
- `/studio` — auto-redirect based on auth state
- `/studio/chat` — student-only: textbook chatbot
- `/studio/analysis` — teacher-only: question DB + textbook range analysis
- `/studio/generate` — teacher-only: lesson material / exam draft generation

Flow:

1. User signs up with email/password and selects a role (student or teacher).
2. Students are routed to `/studio/chat`, ask questions, receive textbook-grounded answers.
3. Questions accumulate in the shared question DB.
4. Teachers are routed to `/studio/analysis` and generate outputs at `/studio/generate`.
5. Unauthenticated users are redirected to `/studio/login`.

## Important Files

- `src/lib/auth-context.tsx`
  - authentication provider (email/password, role, localStorage MVP)
- `src/lib/studio-context.tsx`
  - shared state provider (bot, chat, question DB, teacher outputs)
- `src/app/studio/layout.tsx`
  - studio shell with auth + role-aware sidebar and navigation
- `src/app/studio/login/page.tsx`
  - login and signup page
- `src/app/studio/page.tsx`
  - auth-based redirect entry point
- `src/app/studio/chat/page.tsx`
  - student chatbot page
- `src/app/studio/analysis/page.tsx`
  - teacher question analysis page
- `src/app/studio/generate/page.tsx`
  - teacher lesson/exam generation page
- `src/components/studio-ui.tsx`
  - shared presentation components for the studio
- `src/lib/studio-data.ts`
  - seeded textbook, section, and question-cluster data
- `src/lib/studio-generation.ts`
  - grounded answer and teacher-output generation logic

## Working Rules

- Preserve the app-style dashboard UX in `/studio`.
- Keep textbook answers grounded to unit/page evidence.
- Keep the student flow and teacher flow connected through the shared question DB concept.
- When changing functionality, update `README.md` so the GitHub repository page matches the current product.
- If a task asks for progress documentation, store it under the `report/` directory.
