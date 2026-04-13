# ProofLoop

**학생의 질문이, 교사의 수업이 된다.**

ProofLoop는 Gemini 2.5 Flash 기반 교과서 챗봇으로 학생이 교과서 범위 안에서 학습하면서 자신의 약점을 파악하고, 교사는 반 시스템과 실시간 대시보드로 학생 개개인의 약점과 반 공통 오개념을 동시에 확인해 수업 자료와 시험 초안을 만드는, **교과서 기반 개인화 학습 루프**입니다.

## 핵심 개념: 지속적 학습 검증 루프

학생은 AI 챗봇을 자유롭게 사용할 수 있지만, **AI가 학습을 대신해 줄 수는 없습니다.** 모든 대화에서 AI는 다음 세 가지를 매번 동시에 수행합니다:

1. **교과서 근거 답변** — 해당 반의 교과서 범위 안에서만 답하며, 단원명과 쪽수 근거를 포함합니다.
2. **이해도 실시간 측정** — 매 답변에서 학생의 이해 수준을 1(매우 부족)~5(우수)로 판정합니다.
3. **후속 서술형 질문** — 매 답변 끝에 찍어서 맞출 수 없는 서술형 질문을 제시합니다.

과제를 AI에게 시키려 해도 AI가 학생을 역으로 검증하므로, **AI 사용 자체가 학습 행위**가 됩니다.

## 주요 기능

### 학생

- Gemini 2.5 Flash 기반 교과서 챗봇 (교과서 근거 + 이해도 측정 + 후속 질문)
- 과제 대행 감지: "풀어줘/답 알려줘" 시 답을 거절하고 서술형 확인 질문 발행
- 가입 시 학년 선택 (중1~고3), 반 참여 후 과목별 챗봇 자동 전환
- 대화 데이터가 자동으로 교사 대시보드에 누적

### 교사

- **반(Class) 시스템**: 6자리 초대 코드로 학생 초대, 반당 최대 35명
- **실시간 대시보드**: 누적 질문 수, 참여 학생 수, 상위 오개념, 평균 이해도 집계
- **학생별 약점 트래킹**: 학생별 질문 횟수, 약점 개념, 오개념 태그, 최근 질문
- **수업 자료 생성**: 단원 선택 → 슬라이드 아웃라인, 확인 질문, 교사 메모
- **시험 초안 생성**: 4지선다 문항 + 정답 + 근거 + 예상 함정
- **내보내기**: 클립보드 복사 / 파일 다운로드

### 공통

- 55종 이상 실제 한국 교과서 카탈로그 (10개 출판사, 15개 과목)
- Supabase 기반 이메일+비밀번호 인증 (서버 프록시 방식)
- 반응형 UI: Pretendard 폰트, 모바일 햄버거 메뉴, 한국어 줄바꿈 최적화

## 페이지 구조

| 경로 | 설명 |
|---|---|
| `/` | 스플래시 랜딩 → `/studio/login`으로 리다이렉트 |
| `/studio/login` | 이메일+비밀번호 로그인/회원가입 (학년, 역할 선택) |
| `/studio` | 인증 상태에 따라 자동 라우팅 |
| `/studio/chat` | 학생 전용: 교과서 챗봇 |
| `/studio/analysis` | 교사 전용: 질문 분석 대시보드 |
| `/studio/generate` | 교사 전용: 수업 자료/시험 초안 생성 |
| `/studio/classes` | 교사 전용: 반 관리 (생성, 초대 코드, 학생 약점) |
| `/studio/mypage` | 프로필 (이름 수정, 비밀번호 변경, 로그아웃) |

## 기술 스택

- **프론트엔드**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **백엔드/DB**: Supabase (PostgreSQL, Auth, RLS)
- **AI**: Gemini 2.5 Flash (학생 챗봇), Claude Code (개발 에이전트)
- **폰트**: Pretendard (`word-break: keep-all` 한국어 최적화)

## 로컬 개발

```bash
npm install
npm run dev
```

### 환경변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=<Supabase 프로젝트 URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon key>
GEMINI_API_KEY=<Gemini API 키>
```

### 빌드 확인

```bash
npm run lint
npm run build
```

## AI 활용 전략

- **Gemini 2.5 Flash**: 학생 학습 챗봇 엔진 + 지속적 검증기. 교과서 데이터를 system instruction으로 주입해 grounded answering 구현. 매 대화마다 근거 + 이해도 + 후속 질문을 하나의 API 호출로 처리.
- **Claude Code**: 기획 정제, 아키텍처 설계, 프론트엔드 구현, API 설계, Supabase 통합, 문서화를 일관된 품질로 수행하는 개발 에이전트.
- **결정론적 생성 로직**: 교사용 수업 자료/시험 초안은 외부 API 없이 `src/lib/studio-generation.ts`에서 생성해 데모 안정성 확보.

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 스플래시 랜딩
│   ├── studio/
│   │   ├── layout.tsx              # 역할 기반 사이드바
│   │   ├── login/page.tsx          # 로그인/회원가입
│   │   ├── chat/page.tsx           # 학생 챗봇
│   │   ├── analysis/page.tsx       # 교사 질문 분석
│   │   ├── generate/page.tsx       # 수업 자료/시험 생성
│   │   ├── classes/page.tsx        # 반 관리
│   │   └── mypage/page.tsx         # 마이페이지
│   └── api/
│       ├── chat/route.ts           # Gemini 챗봇 API
│       ├── classes/route.ts        # 반 CRUD
│       ├── dashboard/route.ts      # 교사 대시보드 집계
│       └── auth/                   # 인증 API
├── lib/
│   ├── auth-context.tsx            # 인증 프로바이더
│   ├── studio-context.tsx          # 도메인 상태 프로바이더
│   ├── studio-data.ts              # 교과서 시드 데이터
│   ├── studio-generation.ts        # 수업/시험 생성 로직
│   └── textbook-catalog.ts         # 55종 교과서 카탈로그
└── components/
    └── studio-ui.tsx               # 공유 UI 컴포넌트
```

## 라이선스

2026 KIT 바이브코딩 공모전 출품작
