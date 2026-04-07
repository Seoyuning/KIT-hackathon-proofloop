import type { DiagnosisPayload } from "@/lib/types";

const MIN_BRIEF_LENGTH = 40;
const MIN_SUBMISSION_LENGTH = 40;

export function getPayloadValidationMessage(payload: DiagnosisPayload) {
  if (payload.studentName.trim().length === 0) {
    return "학습자 이름을 입력해 주세요.";
  }

  if (payload.assignmentTitle.trim().length === 0) {
    return "과제명을 입력해 주세요.";
  }

  if (payload.assignmentBrief.trim().length < MIN_BRIEF_LENGTH) {
    return `과제 설명을 최소 ${MIN_BRIEF_LENGTH}자 이상 입력해 주세요. 진단 문맥이 충분해야 합니다.`;
  }

  if (payload.submission.trim().length < MIN_SUBMISSION_LENGTH) {
    return `학생 제출물 또는 설명을 최소 ${MIN_SUBMISSION_LENGTH}자 이상 입력해 주세요.`;
  }

  return null;
}
