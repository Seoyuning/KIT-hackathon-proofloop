import type { Metadata } from "next";
import Link from "next/link";

const navigation = [
  { href: "#problem", label: "문제 정의" },
  { href: "#audience", label: "누가 쓰는가" },
  { href: "#product", label: "제품 구조" },
  { href: "#screens", label: "화면 미리보기" },
  { href: "#difference", label: "차별점" },
  { href: "#faq", label: "FAQ" },
];

const studentScreens = [
  {
    tag: "학생 · /studio/chat",
    title: "교과서 범위 안에서만 답하는 챗봇",
    copy:
      "학년·과목·출판사를 고르면 해당 교과서의 단원과 페이지 범위 안에서만 답합니다. 답변 옆에는 항상 단원/페이지 근거가 함께 붙어, 학생이 어디를 다시 펼쳐 읽어야 하는지 알 수 있습니다.",
    points: [
      "시드 교과서: 고등학교 수학, 중학교 과학, 고등학교 국어",
      "답변에 단원·페이지 근거 자동 부착",
      "질문은 자동으로 통합 질문 DB에 적립",
    ],
  },
  {
    tag: "교사 · /studio/analysis",
    title: "반 전체의 질문을 한 화면으로 훑는 분석 뷰",
    copy:
      "학생들이 실제로 어디서 막혔는지 단원별 클러스터로 정렬해서 보여줍니다. 개인 상담이 아니라, 이번 수업에서 먼저 다뤄야 할 개념을 고르는 데 최적화된 화면입니다.",
    points: [
      "질문이 몰린 단원 / 개념 상위 정렬",
      "교과서 범위 기반 약점 카테고리 표시",
      "수업 자료·시험 초안 생성 페이지로 바로 연결",
    ],
  },
  {
    tag: "교사 · /studio/generate",
    title: "수업 자료 / 시험 초안을 바로 만드는 생성 뷰",
    copy:
      "선택한 교과서 범위와 질문 데이터를 입력으로 받아, 수업 자료 초안과 시험 초안을 즉시 만듭니다. 감이 아니라 학생 데이터에 정렬된 초안이 출발점이 됩니다.",
    points: [
      "수업용 학습지·개념 정리 초안",
      "단원 기반 시험 초안",
      "편집 가능한 형태로 출력",
    ],
  },
];

const differentiators = [
  {
    label: "일반 AI 챗봇",
    good: false,
    copy: "범위 제한 없이 어디서든 답해서 학생이 교과서를 벗어나기 쉽고, 교사가 진도를 통제하기 어렵습니다.",
  },
  {
    label: "AI 튜터 서비스",
    good: false,
    copy: "학생 한 명의 학습 경험에는 집중하지만, 반 전체의 질문 흐름과 교사 수업 준비는 연결되지 않습니다.",
  },
  {
    label: "교사용 AI 생성기",
    good: false,
    copy: "자료와 시험을 빠르게 만들지만, 실제 그 반 학생들이 어디서 막혔는지를 반영하기 어렵습니다.",
  },
  {
    label: "ProofLoop",
    good: true,
    copy: "교과서 범위에 고정된 학생 챗봇과 교사 분석·생성 도구가 같은 질문 DB를 공유합니다. 학생이 남긴 질문이 교사 수업 준비의 입력이 됩니다.",
  },
];

const faqItems = [
  {
    q: "학생은 어떻게 시작하나요?",
    a: "회원가입 시 학생 역할을 선택하면 바로 /studio/chat 으로 들어가, 자기 교과서에 해당하는 봇을 고르고 질문을 시작하면 됩니다. 별도 설치나 설정은 필요하지 않습니다.",
  },
  {
    q: "교사는 어떤 화면을 사용하나요?",
    a: "교사는 /studio/analysis 에서 학생들의 질문 클러스터를 먼저 확인하고, /studio/generate 에서 해당 범위의 수업 자료와 시험 초안을 생성합니다. 학생 페이지와는 완전히 분리되어 있습니다.",
  },
  {
    q: "교과서 범위를 어떻게 지키나요?",
    a: "답변 생성 로직은 교과서 단원/페이지 스키마를 입력으로 받고, 결과에는 항상 근거가 함께 반환됩니다. 범위를 벗어나는 질문에는 범위 안에서 답할 수 있는 부분만 제공합니다.",
  },
  {
    q: "데이터는 어디에 저장되나요?",
    a: "현재 MVP 단계에서는 학생 질문과 교사 출력이 같은 Context 위에서 공유되며, 인증은 Supabase로 관리합니다. 실제 학교/학원 도입 시에는 별도 DB 연동을 계획하고 있습니다.",
  },
  {
    q: "AI가 교사를 대체하나요?",
    a: "아닙니다. ProofLoop는 수업 전 5분 안에 어느 개념과 어느 학생을 먼저 볼지 고르는 운영 보조 도구입니다. 코칭과 수업 진행은 여전히 교사가 담당합니다.",
  },
];

const roleCards = [
  {
    title: "담임형 강사 / 튜터",
    copy:
      "수업만 하는 사람이 아니라, 과제 제출물과 학습 리스크를 함께 관리하는 역할에 가장 잘 맞습니다. 학생별로 긴 코칭을 하기보다 짧게 확인할 대상을 고르는 용도입니다.",
  },
  {
    title: "학습 매니저 / 운영 매니저",
    copy:
      "출석, 과제 제출, AI 사용 흔적까지 같이 보며 어느 학생을 먼저 챙길지 정해야 하는 운영 역할에 적합합니다. 반 전체를 빠르게 훑는 triage 도구에 가깝습니다.",
  },
  {
    title: "부트캠프 TA / 멘토",
    copy:
      "많은 학생의 제출물을 한꺼번에 검토하면서, 어디가 약한지와 어떤 질문을 던질지 빠르게 정리해야 하는 환경에 잘 맞습니다.",
  },
];

const fitCards = [
  {
    title: "잘 맞는 상황",
    copy:
      "한 명이 20명 이상 학생을 관리하고, 과제 검토 뒤에 짧은 확인 질문이나 보충 설명을 붙일 수 있는 반 운영 환경.",
  },
  {
    title: "덜 맞는 상황",
    copy:
      "강의만 하고 학생별 후속 조치를 거의 하지 않는 순수 대형 강의형 수업. 이런 경우엔 개별 진단보다 전체 강의 품질 지표가 더 중요합니다.",
  },
  {
    title: "대체하지 않는 것",
    copy:
      "ProofLoop는 개인 과외나 장기 코칭을 대체하지 않습니다. 먼저 확인할 학생과 부족한 개념을 빠르게 고르는 운영 워크벤치입니다.",
  },
];

const workflow = [
  {
    step: "01",
    title: "과제 맥락과 제출 흔적 수집",
    copy:
      "과제 설명, 학생 제출 내용, AI에 던진 프롬프트를 함께 받아 결과물만으로는 보이지 않는 학습 흔적을 모읍니다.",
  },
  {
    step: "02",
    title: "학생별 약점과 위험 신호 정리",
    copy:
      "개념 이해 부족, 전이 실패, 반성 부족, AI 의존 흔적을 나눠 보고 어느 학생이 특히 취약한지 빠르게 드러냅니다.",
  },
  {
    step: "03",
    title: "점검 우선순위 결정",
    copy:
      "예전의 코칭 순서가 아니라, 이번 수업이나 이번 주 안에 누굴 먼저 짧게 확인할지 정하는 운영 우선순위를 제공합니다.",
  },
];

export const metadata: Metadata = {
  title: "ProofLoop",
  description:
    "AI 과제 제출 이후, 반 전체에서 먼저 확인할 학생을 고르는 학습 점검 워크벤치",
};

export default function Home() {
  return (
    <main className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="paper-panel overflow-hidden rounded-[32px] px-5 py-5 sm:px-8 sm:py-8">
          <nav className="mb-8 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="eyebrow text-xs text-muted">ProofLoop</div>
              <p className="mt-2 text-sm text-muted">
                AI 과제 제출 이후, 반 전체에서 먼저 확인할 학생을 고르는 학습 점검 워크벤치
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  className="pill rounded-full px-4 py-2 text-sm text-foreground transition-transform duration-200 hover:-translate-y-0.5"
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
              <Link
                className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                href="/studio/login"
              >
                로그인 / 시작하기
              </Link>
            </div>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-line bg-white/50 px-4 py-2 text-xs font-medium text-muted">
                반 운영용 학습 부채 점검 워크벤치
              </div>
              <div className="max-w-4xl">
                <h1 className="display-title text-5xl leading-[0.94] text-navy sm:text-6xl lg:text-7xl">
                  강의를 더 개인화하는 도구가 아니라,
                  <br />
                  먼저 볼 학생을 고르는 도구.
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-muted sm:text-xl">
                  ProofLoop는 학생 한 명 한 명을 길게 코칭하는 서비스가 아닙니다. 과제 제출물과 AI 사용 흔적을
                  바탕으로 <span className="font-semibold text-navy">어느 학생에게 지금 3분을 써야 하는지</span>를
                  빠르게 보여주는 반 운영용 점검 화면입니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                  href="/studio/login"
                >
                  로그인하고 시작하기
                </Link>
                <a
                  className="pill rounded-full px-5 py-3 text-sm font-semibold text-foreground transition-transform duration-200 hover:-translate-y-0.5"
                  href="#audience"
                >
                  타겟 사용자 보기
                </a>
              </div>
            </div>

            <aside className="flex h-full flex-col justify-between rounded-[28px] border border-navy/10 bg-navy px-5 py-5 text-white sm:px-6">
              <div>
                <p className="eyebrow text-xs text-white/70">포지셔닝</p>
                <h2 className="mt-4 text-2xl font-semibold leading-tight">
                  코칭 순서가 아니라
                  <br />
                  점검 우선순위입니다.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  강사가 학생 모두를 각각 깊게 코칭하지 않는다는 전제를 반영했습니다. 그래서 ProofLoop는 개인화
                  추천 서비스가 아니라,{" "}
                  <span className="font-semibold text-white">반 전체에서 위험 신호가 큰 학생을 먼저 골라내는 triage
                  도구</span>
                  로 설계합니다.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold">핵심 출력</p>
                  <p className="mt-2 text-sm leading-6 text-white/74">
                    점검 우선순위, 학생별 약점, 짧은 확인 질문, 다음 액션
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold">가장 잘 맞는 사용자</p>
                  <p className="mt-2 text-sm leading-6 text-white/74">
                    학원 담임 강사, 코호트 운영자, 멘토, TA처럼 수업 이후 후속 점검이 있는 역할
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold">덜 맞는 사용자</p>
                  <p className="mt-2 text-sm leading-6 text-white/74">
                    학생별 후속 조치가 거의 없는 대형 강의형 강사
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="problem" className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            title="문제 정의"
            copy="AI로 제출물을 빠르게 만드는 학생은 늘었지만, 누가 실제로 이해했고 누가 개념을 비워 둔 채 통과했는지는 강사가 빠르게 파악하기 어렵습니다."
          />
          <InfoCard
            title="왜 지금 필요한가"
            copy="강사는 학생별 맞춤 코칭을 길게 하기 어렵습니다. 대신 짧은 시간 안에 어떤 학생을 먼저 확인할지 정해야 하고, 이 의사결정이 반 운영 품질을 좌우합니다."
          />
          <InfoCard
            title="제품의 역할"
            copy="ProofLoop는 학습 개인화 엔진이 아니라, 반 전체를 훑어 보고 점검 우선순위를 정하는 운영용 대시보드이자 학생 약점 파악 도구입니다."
          />
        </section>

        <section id="audience" className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
          <SectionHeader
            kicker="누가 쓰는가"
            title="타겟은 학원 교강사 전체가 아니라, 학생 상태를 함께 관리하는 역할입니다."
            copy="순수 강의형 역할에는 효용이 약할 수 있습니다. 가장 큰 가치는 과제 검토 뒤에 짧은 확인 질문, 보충 설명, 후속 체크를 붙여야 하는 운영형 역할에서 나옵니다."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {roleCards.map((card) => (
              <InfoCard key={card.title} title={card.title} copy={card.copy} />
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {fitCards.map((card) => (
              <InfoCard key={card.title} title={card.title} copy={card.copy} />
            ))}
          </div>
        </section>

        <section id="product" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="제품 구조"
              title="서비스 화면은 /studio 로 분리했습니다."
              copy="루트 경로는 제품 설명과 포지셔닝을 보여주고, 실제 작업 화면은 별도 경로에서 학생별 점검과 반 전체 우선순위 판단에 집중합니다."
            />

            <div className="mt-6 grid gap-3">
              {workflow.map((item) => (
                <div key={item.step} className="rounded-[24px] border border-line bg-white/65 p-4">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow text-xs text-muted">{item.step}</span>
                    <p className="text-lg font-semibold text-navy">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="핵심 메시지"
              title="이 서비스는 개별 맞춤형 학습 플랫폼보다 운영 보조 도구에 가깝습니다."
              copy="그래서 화면 용어도 코칭보다 점검, 개인화보다 약점 파악, 장기 멘토링보다 짧은 후속 확인에 맞춰 다시 정리했습니다."
            />

            <div className="mt-6 space-y-4">
              <SummaryBlock
                title="왜 점검 우선순위인가"
                copy="강사가 모든 학생을 깊게 케어하지 못한다는 현실을 반영해, 누굴 먼저 볼지 정하는 실행 가능 정보만 남겼습니다."
              />
              <SummaryBlock
                title="어떤 약점을 보여주나"
                copy="개념 이해 부족, 전이 실패, 반성 부족, AI 의존 흔적처럼 수업 이후 보충 설명에 직접 연결되는 약점을 보여줍니다."
              />
              <SummaryBlock
                title="어떤 행동을 돕나"
                copy="수업 전 5분 점검, 과제 리뷰 우선순위 선정, 짧은 확인 질문 배포, 위험 학생 선제 파악."
              />
              <Link
                className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                href="/studio/login"
              >
                로그인하고 /studio 열기
              </Link>
            </div>
          </div>
        </section>

        <section id="screens" className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
          <SectionHeader
            kicker="화면 미리보기"
            title="학생용 챗봇, 교사용 분석, 교사용 생성. 세 화면이 같은 교과서 데이터 위에 올라갑니다."
            copy="ProofLoop는 한 사람을 위한 단일 인터페이스가 아니라, 역할별로 완전히 분리된 세 개의 작업 화면으로 구성됩니다. 각 화면은 공유된 질문 DB를 통해 자연스럽게 이어집니다."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {studentScreens.map((screen) => (
              <div
                key={screen.title}
                className="flex h-full flex-col rounded-[26px] border border-line bg-white/70 p-5"
              >
                <span className="eyebrow text-xs text-muted">{screen.tag}</span>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-navy">
                  {screen.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{screen.copy}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-navy">
                  {screen.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-[0.55rem] h-1.5 w-1.5 flex-none rounded-full bg-orange" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="difference" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="차별점"
              title="AI 챗봇도, AI 튜터도, AI 생성기도 아닙니다."
              copy="ProofLoop는 이 셋을 잇는 연결 조직에 가깝습니다. 학생이 남긴 흔적이 교사 준비의 입력이 되도록 데이터 파이프라인을 한 줄로 만들어 둔 것이 핵심입니다."
            />

            <div className="mt-6 space-y-3 text-sm leading-6 text-muted">
              <p>
                대부분의 교육 AI 제품은 학생 또는 교사 중 한쪽만 바라봅니다. 그래서 학생이 어디서 막혔는지는
                교사에게 잘 전달되지 않고, 교사가 만든 자료도 실제 그 반의 학습 리스크를 반영하기 어렵습니다.
              </p>
              <p>
                ProofLoop는 반대로 <span className="font-semibold text-navy">하나의 교과서 데이터 + 하나의 질문
                DB</span> 위에 학생 화면과 교사 화면을 올렸습니다. 설계상 두 사용자가 같은 신호를 공유하게 되는
                구조입니다.
              </p>
            </div>
          </div>

          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <div className="grid gap-3">
              {differentiators.map((row) => (
                <div
                  key={row.label}
                  className={`rounded-[22px] border p-4 ${
                    row.good
                      ? "border-navy/30 bg-navy text-white"
                      : "border-line bg-white/65"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold ${
                        row.good ? "bg-orange text-white" : "bg-line text-muted"
                      }`}
                    >
                      {row.good ? "우리" : "기존"}
                    </span>
                    <p
                      className={`text-sm font-semibold ${
                        row.good ? "text-white" : "text-navy"
                      }`}
                    >
                      {row.label}
                    </p>
                  </div>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      row.good ? "text-white/80" : "text-muted"
                    }`}
                  >
                    {row.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
          <SectionHeader
            kicker="자주 묻는 질문"
            title="사용을 시작하기 전에 가장 많이 나오는 질문 다섯 가지."
            copy="심사와 데모 환경에서 반복적으로 들어온 질문을 중심으로 정리했습니다. 더 깊은 기술/운영 질문은 /studio 내부 화면과 report/ 디렉터리의 일일 로그에서 확인할 수 있습니다."
          />

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div
                key={item.q}
                className="rounded-[24px] border border-line bg-white/65 p-4"
              >
                <p className="text-sm font-semibold text-navy">Q. {item.q}</p>
                <p className="mt-2 text-sm leading-6 text-muted">A. {item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="paper-panel overflow-hidden rounded-[32px] border border-navy/10 bg-navy px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="eyebrow text-xs text-white/70">지금 시작하기</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                학생 질문과 교사 준비를
                <br />
                같은 화면 위에서 연결해 보세요.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                이메일과 비밀번호로 바로 가입하고, 학생 또는 교사 역할을 고르면 1분 안에 /studio 에 들어갈 수
                있습니다. 시드 교과서 데이터가 준비되어 있어, 별도 설정 없이 전체 흐름을 바로 체험할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                className="rounded-full bg-orange px-5 py-3 text-center text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                href="/studio/login"
              >
                로그인 / 회원가입
              </Link>
              <a
                className="pill rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                href="#product"
              >
                제품 구조 다시 보기
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeader({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <p className="eyebrow text-xs text-muted">{kicker}</p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">{copy}</p>
    </div>
  );
}

function InfoCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="paper-panel rounded-[26px] px-5 py-5">
      <p className="eyebrow text-xs text-muted">{title}</p>
      <p className="mt-3 text-base leading-7 text-navy">{copy}</p>
    </div>
  );
}

function SummaryBlock({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[24px] border border-line bg-white/65 p-4">
      <p className="text-sm font-semibold text-navy">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
    </div>
  );
}
