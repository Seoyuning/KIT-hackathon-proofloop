# Design: ProofLoop

Generated for the 2026 Korea IT Academy Vibe Coding Hackathon  
Mode: Builder fast-track  
Status: Draft approved for MVP implementation

## Problem

AI has made assignment completion faster, but it has also made real understanding harder to see.

In coding education environments, instructors now face a new operational problem:

- a learner can produce a polished deliverable with AI support
- the instructor still cannot tell whether the learner understands the design decisions
- weak understanding is discovered later, when the next assignment breaks or the learner loses confidence

This is not an LMS problem. It is a visibility and intervention problem created by AI-native learning.

## Why Now

- AI tutors and coding copilots are spreading quickly in education.
- Teacher-assistant products already help with lesson planning and grading.
- The next gap is not "more content generation" but "proof of learning after AI assistance."

That gap is sharp, current, and easy for judges to understand in one sentence.

## Target User & Narrowest Wedge

### Primary user

Coding bootcamp and academy instructors who review learner submissions every day.

### Secondary users

- learners who want more honest feedback than "it works"
- operations managers who need early warning on hidden learning debt and dropout risk

### Narrowest wedge

One instructor reviewing one learner's AI-assisted coding assignment.

The smallest useful version is:

- input the assignment brief
- input the learner's submission or explanation
- input the AI prompt trace
- get a learning evidence diagnosis and the next intervention step

## Alternatives Considered

### Alternative A: AI tutor

Rejected because the space is crowded and the value proposition is familiar.

### Alternative B: AI grading assistant

Rejected because it optimizes teacher time, but it does not solve the new AI-era blind spot: hidden shallow understanding.

### Alternative C: ProofLoop

Chosen because it addresses a new pain point created by AI itself and gives a crisp demo story:

> "This learner finished the task, but did they actually learn?"

## Recommended Approach

Build a polished web demo with three layers:

### 1. Diagnosis Studio

Single learner workflow for judges and instructors.

Outputs:

- evidence score
- risk flags
- misconceptions
- adaptive defense questions
- intervention plan

### 2. Instructor Radar

Cohort view that sorts learners by coaching priority rather than by completion status.

### 3. AI strategy panel

Explain the system design clearly:

- evidence capture
- reasoning diagnosis
- instructor action generation

## AI Execution Strategy

### MVP runtime

- deterministic heuristic evaluator for reliability in public demos
- optional live model scoring via the Gemini API when an API key is configured

### Why this split is smart

- public GitHub stays safe with no exposed secrets
- live deployment still works even if a model call fails
- judges can experience the product flow without waiting for unstable external dependencies

## Constraints

- the repository started empty, so the MVP must be fast to scaffold and easy to deploy
- public repo requirement means secrets cannot be embedded
- hackathon judging rewards clarity and demo reliability, not just raw complexity

## Success Criteria

- a judge understands the problem in under 20 seconds
- the live demo shows both individual diagnosis and cohort prioritization
- the repository documents the concept and AI strategy clearly
- the app builds and deploys cleanly without secret leakage

## Open Questions

- Should the final submitted deployment use live AI scoring or stay fully demo-safe?
- Will the team add user authentication or keep the judging version as a single-page demo?
- Should the next iteration include file upload support for code artifacts?

## Distribution Plan

- public GitHub repository for source review
- Vercel deployment for the live URL
- AI report PDF drafted from `docs/AI_REPORT_DRAFT.md`
