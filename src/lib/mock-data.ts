import { heuristicDiagnosis } from "@/lib/diagnosis";
import type { CohortStudent, DemoCase, DiagnosisPayload } from "@/lib/types";

export const demoCases: DemoCase[] = [
  {
    id: "minjun",
    label: "Fast finisher",
    studentName: "민준",
    track: "프론트엔드 부트캠프",
    persona: "결과물은 빨리 내지만 AI 의존도가 높은 학습자",
    assignmentTitle: "React 상태 흐름 디버깅",
    assignmentBrief:
      "학생은 게시글 좋아요 UI를 구현해야 한다. optimistic update를 적용하되 실패 시 rollback이 필요하다. 왜 상태를 상위 컴포넌트에서 관리해야 하는지, race condition을 어떻게 막는지 설명해야 한다.",
    submission:
      "좋아요 버튼을 누르면 숫자가 바로 올라가고 서버 실패면 다시 원래 값으로 돌립니다. useState로 값을 관리했고 API를 호출하면 됩니다. 상태는 상위에서 주면 편합니다. 에러는 catch에서 처리했습니다. 전체적으로 잘 동작합니다.",
    aiTrace:
      "정답 코드 전체 주세요. optimistic update 예제도 같이 주세요. 바로 제출 가능한 형태로 만들어 주세요. rollback은 catch에 넣으면 되나요?",
  },
  {
    id: "seoyeon",
    label: "Deep learner",
    studentName: "서연",
    track: "프론트엔드 부트캠프",
    persona: "AI를 도구로 쓰되 스스로 검증하는 학습자",
    assignmentTitle: "React 상태 흐름 디버깅",
    assignmentBrief:
      "학생은 게시글 좋아요 UI를 구현해야 한다. optimistic update를 적용하되 실패 시 rollback이 필요하다. 왜 상태를 상위 컴포넌트에서 관리해야 하는지, race condition을 어떻게 막는지 설명해야 한다.",
    submission:
      "좋아요 수를 하위 버튼에서만 갖고 있으면 목록 정렬이나 다른 카드와의 동기화가 깨질 수 있어서 상태를 부모에 올렸습니다. optimistic update는 사용자 반응성을 높이는 대신 race condition 리스크가 생기므로 requestId로 최신 요청만 반영했습니다. 실패한 요청만 rollback 하도록 분리한 이유는 전체 상태를 되돌리면 다른 사용자의 최신 반응까지 지울 수 있기 때문입니다. 테스트에서는 네트워크 지연을 강제로 넣어 out-of-order 응답을 재현했고, root cause를 확인한 뒤 rollback 범위를 줄였습니다. If we change the requirement to batch likes from multiple tabs, I would move the merge logic to a shared store and compare that trade-off first.",
    aiTrace:
      "제가 생각한 rollback 흐름이 맞는지 검토해 주세요. requestId를 두는 방식 말고 더 단순한 대안이 있는지도 비교해 주세요. 제가 직접 테스트한 edge case가 충분한지도 확인해 주세요.",
  },
  {
    id: "doyun",
    label: "Silent struggler",
    studentName: "도윤",
    track: "백엔드 부트캠프",
    persona: "겉으로는 조용하지만 개념 연결이 약한 학습자",
    assignmentTitle: "비동기 작업 큐 설계",
    assignmentBrief:
      "사용자 업로드가 몰릴 때 이미지 리사이징을 비동기 큐로 분리하라. 동기 처리 대비 장점, 작업 실패 재시도 전략, idempotency가 왜 필요한지 설명해야 한다.",
    submission:
      "큐를 쓰면 서버가 덜 느려집니다. 업로드가 많을 때 백그라운드에서 돌리면 되고 실패하면 다시 시도하면 됩니다. idempotency는 중복 방지입니다. Redis 같은 걸 쓰면 될 것 같습니다.",
    aiTrace:
      "작업 큐가 뭔지 쉽게 설명해 주세요. idempotency 예시도 하나만 주세요.",
  },
  {
    id: "jiwoo",
    label: "False confidence",
    studentName: "지우",
    track: "AI 서비스 기획",
    persona: "문서를 매끈하게 쓰지만 논리 연결이 빈 약한 학습자",
    assignmentTitle: "AI 상담 챗봇 운영 설계",
    assignmentBrief:
      "학원 수강생 문의 챗봇을 설계하라. 개인정보 최소 수집 원칙, human handoff 기준, 환각 응답을 줄이기 위한 안전장치를 설명해야 한다.",
    submission:
      "챗봇은 24시간 대응할 수 있어서 효율적입니다. 개인정보는 최소한만 받으면 되고, 어려운 질문은 상담사에게 넘기면 됩니다. 환각은 프롬프트를 잘 쓰면 줄어듭니다. 전체적으로 고객 만족도가 오를 것입니다.",
    aiTrace:
      "학원 챗봇 운영 기획서 초안 써줘. 발표용으로 깔끔하게 정리해줘. handoff 기준도 자연스럽게 넣어줘.",
  },
  {
    id: "harin",
    label: "Recovering learner",
    studentName: "하린",
    track: "백엔드 부트캠프",
    persona: "처음엔 막혔지만 스스로 재구성하며 회복 중인 학습자",
    assignmentTitle: "비동기 작업 큐 설계",
    assignmentBrief:
      "사용자 업로드가 몰릴 때 이미지 리사이징을 비동기 큐로 분리하라. 동기 처리 대비 장점, 작업 실패 재시도 전략, idempotency가 왜 필요한지 설명해야 한다.",
    submission:
      "처음에는 단순히 worker를 늘리면 된다고 생각했지만, 업로드 요청을 동기로 처리하면 웹 요청 시간이 길어지고 실패 지점이 섞여서 추적이 어려웠습니다. 큐를 두면 API 서버는 접수만 하고 worker가 별도로 처리해서 응답 시간이 안정됩니다. 재시도는 무한 반복이 아니라 최대 횟수와 dead-letter queue를 둬야 하고, idempotency key가 없으면 같은 이미지가 중복 처리될 수 있습니다. 제가 비교한 trade-off는 처리 지연과 운영 복잡도였고, 다음 단계는 메트릭을 붙여 병목을 확인하는 것입니다. 만약 비디오 업로드처럼 작업 시간이 더 길어지면 retry 전략보다 우선 큐 분리와 우선순위 조정이 먼저 필요합니다.",
    aiTrace:
      "제가 정리한 설명에서 빠진 위험 요소가 있는지 체크해 주세요. dead-letter queue를 꼭 넣어야 하는지 이유도 설명해 주세요.",
  },
];

export function toPayload(demoCase: DemoCase): DiagnosisPayload {
  return {
    studentName: demoCase.studentName,
    assignmentTitle: demoCase.assignmentTitle,
    assignmentBrief: demoCase.assignmentBrief,
    submission: demoCase.submission,
    aiTrace: demoCase.aiTrace,
  };
}

export const cohortStudents: CohortStudent[] = demoCases.map((demoCase) => ({
  id: demoCase.id,
  caseId: demoCase.id,
  name: demoCase.studentName,
  track: demoCase.track,
  persona: demoCase.persona,
  diagnosis: heuristicDiagnosis(toPayload(demoCase)),
}));
