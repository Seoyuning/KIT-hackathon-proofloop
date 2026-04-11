import type { Metadata } from "next";
import Link from "next/link";

const navigation = [
  { href: "#problem", label: "문제 정의" },
  { href: "#audience", label: "누가 쓰는가" },
  { href: "#product", label: "제품 구조" },
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
