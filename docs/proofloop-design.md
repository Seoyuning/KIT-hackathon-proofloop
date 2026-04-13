# Design: ProofLoop

2026 Korea IT Academy Vibe Coding Hackathon 기획 문서

## 문제 정의

1. **학생의 AI 과제 대행**: AI를 금지하면 학습 도구로서의 가치가 사라지고, 허용하면 과제 대행이 됩니다.
2. **학생 약점 파악 불가**: 학생마다 이해가 부족한 개념이 다른데, 데이터로 파악할 도구가 없습니다.
3. **학생-교사 데이터 단절**: 교사는 수업 자료와 시험지를 만들 때 감에 의존합니다.

## 핵심 아이디어: 지속적 학습 검증 루프

학생은 AI를 자유롭게 사용합니다. 하지만 **모든 대화에서** AI가 세 가지를 동시에 수행합니다:

1. **교과서 근거 답변** — 단원명과 쪽수 근거 포함
2. **이해도 실시간 측정** — 1~5점, DB 저장
3. **후속 서술형 질문** — 찍어서 맞출 수 없는 형태

과제를 시키면 AI가 답을 거절하고 학생을 역으로 검증합니다. **AI 사용 자체가 학습 행위**가 됩니다.

## 제품 구조

### 학생 플로우
1. 가입 시 학년 선택 (중1~고3)
2. 초대 코드로 반 참여 → 해당 교과서 챗봇 자동 활성화
3. 반 미참여 시 챗봇 사용 차단 (반에 먼저 참여하세요)
4. 매 답변에 근거 카드 + 이해도 바 + 후속 질문 카드 표시
5. 모든 데이터가 Supabase DB에 자동 저장

### 교사 플로우
1. 반 만들기 (학년/과목/출판사/교과서 지정, 6자리 초대 코드 자동 생성)
2. 여러 반 동시 관리 — 사이드바에서 반 간 전환
3. 실시간 대시보드: 누적 질문, 참여 학생, 상위 오개념, 단원별 이해도
4. 학생별 약점 트래킹: 학생별 질문 횟수, 약점 개념, 오개념 태그
5. 수업 자료/시험 초안 생성 + 내보내기 (클립보드/파일)
6. 교사 학습 자료 업로드 (사진 촬영/선택, 파일 업로드)

## 라우트

| 경로 | 역할 | 목적 |
|---|---|---|
| `/` | 공통 | 스플래시 → `/studio/login` |
| `/studio/login` | 공통 | 로그인/회원가입 (역할+학년 선택) |
| `/studio/chat` | 학생 | 교과서 챗봇 (검증 루프) |
| `/studio/analysis` | 교사 | 실시간 대시보드 + 단원별 이해도 |
| `/studio/generate` | 교사 | 수업 자료/시험 생성 + 내보내기 |
| `/studio/classes` | 교사 | 반 관리 + 학생별 약점 |
| `/studio/mypage` | 공통 | 프로필 (학년, 과목, 비밀번호) |

## 데이터 구조 (Supabase)

- **profiles**: id, email, name, role, grade, subject
- **classes**: id, teacher_id, name, subject, grade, publisher, textbook_name, invite_code, max_students
- **class_members**: id, class_id, student_id
- **student_questions**: id, class_id, student_id, question, section_title, misconception, understanding_level

## 기술 스택

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Supabase (PostgreSQL, Auth, RLS)
- Gemini 2.5 Flash (학생 챗봇)
- Claude Code (개발 에이전트)

## AI 구조

**Gemini 2.5 Flash**: system instruction에 교과서 단원 데이터 전량 주입 → 매 답변에서 `[근거]`, `[이해도]`, `[후속 질문]` 태그 강제 출력 → 파싱 후 DB 저장 → 교사 대시보드 실시간 집계

## 보안

- API 인증 체크 (채팅, 반 관리, 학생 데이터)
- RLS: 학생 질문은 본인+담당 교사만 접근
- 교사 역할 검증 (반 생성, 학생 데이터 조회)
- 보안 헤더 (X-Frame-Options, X-Content-Type-Options)
- 오픈 리다이렉트 차단

## 현재 한계 + 로드맵

- 교과서 내용 전문 탑재는 다음 단계 (현재는 단원 구조 수준)
- 향후: 출판사 API 연동(비상교육 비바샘, 미래엔 엠티처 등) 또는 교육부 디지털교과서 플랫폼 연계로 교과서 목차 자동 동기화
- 이해도 변화 추이 그래프 (학생별 시간축 시각화)
- SNS OAuth (카카오, 구글) 로그인 추가
