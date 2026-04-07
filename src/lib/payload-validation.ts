import type { DiagnosisPayload } from "@/lib/types";

const MIN_BRIEF_LENGTH = 40;
const MIN_SUBMISSION_LENGTH = 40;

export function getPayloadValidationMessage(payload: DiagnosisPayload) {
  if (payload.studentName.trim().length === 0) {
    return "Add the learner name before running ProofLoop.";
  }

  if (payload.assignmentTitle.trim().length === 0) {
    return "Add the assignment title before running ProofLoop.";
  }

  if (payload.assignmentBrief.trim().length < MIN_BRIEF_LENGTH) {
    return `Add a fuller assignment brief, at least ${MIN_BRIEF_LENGTH} characters, so the diagnosis has enough context.`;
  }

  if (payload.submission.trim().length < MIN_SUBMISSION_LENGTH) {
    return `Add a fuller student submission or explanation, at least ${MIN_SUBMISSION_LENGTH} characters, before analysis.`;
  }

  return null;
}
