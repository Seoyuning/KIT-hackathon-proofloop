@AGENTS.md

# Project Notes

## Active Surface

- `/studio` is the primary end-user application surface.
- `/` should remain the landing / product-positioning page.
- Do not turn `/studio` back into a marketing-style hero page.

## Current Product Model

The current `/studio` flow is:

1. Student selects a textbook bot by subject and publisher.
2. Student asks a question and receives a textbook-grounded answer.
3. The question is accumulated into the integrated question DB.
4. Teacher uses the same question DB to generate lesson materials and exam drafts.

## Important Files

- `src/components/studio-workbench.tsx`
  - main workspace layout and user flow
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
