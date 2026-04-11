# Submission Checklist

## 필수 제출물

- Public GitHub 저장소 주소
  `https://github.com/todo0157/2026-KIT-Vibehackathon`

- 배포된 라이브 URL
  (배포 후 채울 것)

- AI 리포트 PDF
  원본 작성용: [docs/AI_REPORT_DRAFT.md](./AI_REPORT_DRAFT.md)

## 제출 전 확인

- 저장소가 `Public`인지 확인
- `.env`, API 키, 토큰이 커밋되지 않았는지 확인
- 라이브 URL이 열리는지 확인
- `/` 접속 시 `/studio`로 리다이렉트 되는지 확인
- `/studio/login`에서 학생/교사 회원가입 및 로그인이 동작하는지 확인
- 학생 계정으로 `/studio/chat`에서 교과서 봇 답변과 단원/페이지 근거가 정상 출력되는지 확인
- 교사 계정으로 `/studio/analysis`에서 질문 DB 클러스터가 표시되는지 확인
- 교사 계정으로 `/studio/generate`에서 수업 자료 / 시험 초안 생성이 동작하는지 확인
- 학생이 교사 페이지에, 교사가 학생 페이지에 접근하면 리다이렉트되는지 확인
- AI 리포트 PDF에 팀명, 이름, 휴대폰번호가 채워졌는지 확인

## 발표 준비물

- 90초 데모 스크립트: [docs/DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
- 제품/기획 설명 문서: [docs/proofloop-design.md](./proofloop-design.md)

## 추천 발표 순서

1. 문제 정의 — 학생 질문과 교사 수업 준비의 단절
2. 학생 플로우 시연 (`/studio/chat`) — 교과서 범위 고정 답변
3. 교사 플로우 시연 (`/studio/analysis` → `/studio/generate`) — 질문 DB → 수업 자료/시험 초안
4. 한 줄 정리 — "학생과 교사를 같은 교과서 위에서 연결한다"
