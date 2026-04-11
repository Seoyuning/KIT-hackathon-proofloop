import type { Metadata } from "next";
import Link from "next/link";

const navigation = [
  { href: "#problem", label: "문제" },
  { href: "#audience", label: "사용자" },
  { href: "#difference", label: "차별점" },
  { href: "#faq", label: "FAQ" },
];

const problemPoints = [
  {
    index: "01",
    title: "교과서 범위를 벗어나는 답",
    copy:
      "학생이 쓰는 범용 AI는 교과서 범위에 고정되어 있지 않습니다. 정답처럼 보이지만 수업 진도와 어긋난 설명이 섞입니다.",
  },
  {
    index: "02",
    title: "학생–교사 신호의 단절",
    copy:
      "학생이 어디서 막혔는지는 흔적으로 남지만, 교사가 그 데이터를 수업 준비에 반영할 수 있는 경로는 거의 없습니다.",
  },
  {
    index: "03",
    title: "감에 의존하는 수업 준비",
    copy:
      "수업 자료와 시험은 여전히 경험과 직관에 기대어 만들어지고, 실제 반의 학습 상태와 정렬되기 어렵습니다.",
  },
];

const audiencePoints = [
  {
    label: "잘 맞는 환경",
    copy:
      "한 명이 20명 이상의 학생을 관리하고, 과제 검토 뒤에 짧은 확인 질문이나 보충 설명이 붙는 반 운영 환경.",
  },
  {
    label: "덜 맞는 환경",
    copy:
      "학생별 후속 조치가 거의 없는 순수 대형 강의형 수업. 개별 진단보다 전체 강의 품질 지표가 더 중요합니다.",
  },
  {
    label: "대체하지 않는 것",
    copy:
      "개인 과외나 장기 코칭을 대체하지 않습니다. 먼저 볼 학생과 부족한 개념을 고르는 운영 워크벤치입니다.",
  },
];

const differentiators = [
  {
    label: "일반 AI 챗봇",
    copy: "범위 제한 없이 답해 학생이 교과서를 벗어나기 쉽고, 교사가 진도를 통제하기 어렵습니다.",
  },
  {
    label: "AI 튜터 서비스",
    copy: "학생 한 명의 학습 경험에만 집중하고, 반 전체의 질문 흐름과 교사 수업 준비는 연결되지 않습니다.",
  },
  {
    label: "교사용 AI 생성기",
    copy: "자료와 시험을 빠르게 만들지만, 실제 그 반 학생들이 어디서 막혔는지를 반영하기 어렵습니다.",
  },
];

const faqItems = [
  {
    q: "학생은 어떻게 시작하나요?",
    a: "회원가입 시 학생 역할을 고르면 바로 교과서 기반 챗봇을 사용할 수 있습니다. 별도 설치나 설정은 필요하지 않습니다.",
  },
  {
    q: "교사는 어떤 흐름으로 사용하나요?",
    a: "학생 질문이 쌓인 분석 화면에서 시작해, 같은 교과서 범위를 기준으로 수업 자료와 시험 초안을 만듭니다.",
  },
  {
    q: "교과서 범위를 어떻게 지키나요?",
    a: "답변 생성 로직은 교과서 단원·페이지 스키마를 입력으로 받고, 결과에는 항상 근거가 함께 반환됩니다.",
  },
  {
    q: "AI가 교사를 대체하나요?",
    a: "아닙니다. 수업 전 짧은 시간 안에 어느 개념과 어느 학생을 먼저 볼지 고르는 운영 보조 도구입니다.",
  },
];

export const metadata: Metadata = {
  title: "ProofLoop",
  description:
    "교과서 범위 안에서 답하는 학생 챗봇과, 그 질문 데이터를 그대로 받아 수업을 준비하는 교사 워크벤치.",
};

export default function Home() {
  return (
    <main className="min-h-screen text-navy">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <header className="flex items-center justify-between pt-10 pb-8">
          <Link href="/" className="display-title text-xl tracking-tight text-navy">
            ProofLoop
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-navy"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            href="/studio/login"
            className="text-sm font-medium text-navy underline-offset-4 hover:underline"
          >
            로그인 →
          </Link>
        </header>

        <div className="h-px w-full bg-navy/10" />

        <section className="grid gap-16 py-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-muted">
              A CLASSROOM WORKBENCH — NOT ANOTHER TUTOR
            </p>
            <h1 className="display-title mt-8 text-[2.75rem] leading-[1.04] text-navy sm:text-6xl lg:text-[4.25rem]">
              강의를 개인화하는 도구가 아니라,
              <br />
              먼저 볼 학생을 고르는 도구.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              ProofLoop는 교과서 범위 안에서만 답하는 학생 챗봇과, 그 질문 데이터를 그대로 받아 수업을
              준비하는 교사 워크벤치입니다. 학생의 흔적과 교사의 준비가 같은 테이블 위에 놓입니다.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm">
              <Link
                href="/studio/login"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                시작하기
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#problem"
                className="font-medium text-navy underline-offset-4 hover:underline"
              >
                먼저 어떤 문제를 푸는지 보기
              </a>
            </div>
          </div>

          <aside className="flex flex-col justify-end lg:col-span-4">
            <div className="border-t border-navy/15 pt-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted">
                포지셔닝
              </p>
              <p className="mt-4 text-base leading-7 text-navy">
                코칭 순서가 아니라 <span className="font-semibold">점검 우선순위</span>입니다. 반 전체에서 위험
                신호가 큰 학생을 먼저 골라내는 triage 도구로 설계했습니다.
              </p>
            </div>
          </aside>
        </section>

        <div className="h-px w-full bg-navy/10" />

        <section id="problem" className="py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted">
                문제 정의
              </p>
              <h2 className="display-title mt-6 text-3xl leading-tight text-navy sm:text-4xl">
                AI는 넘치는데,
                <br />
                수업에 정렬된 AI는 드뭅니다.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <ul className="divide-y divide-navy/10 border-y border-navy/10">
                {problemPoints.map((item) => (
                  <li
                    key={item.index}
                    className="flex flex-col gap-3 py-8 sm:flex-row sm:gap-10"
                  >
                    <span className="font-mono text-sm tracking-widest text-muted sm:w-16">
                      {item.index}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-muted">
                        {item.copy}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-navy/10" />

        <section id="audience" className="py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted">
                누가 쓰는가
              </p>
              <h2 className="display-title mt-6 text-3xl leading-tight text-navy sm:text-4xl">
                학원 교강사 전체가 아니라,
                <br />
                학생 상태를 같이 관리하는 역할.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-7 text-muted">
                강의만 하는 역할에는 효용이 약할 수 있습니다. 가장 큰 가치는 과제 뒤에 짧은 확인과 보충을 붙이는
                운영형 역할에서 나옵니다.
              </p>
            </div>
            <div className="grid gap-8 lg:col-span-8 lg:grid-cols-3">
              {audiencePoints.map((item) => (
                <div key={item.label} className="border-t border-navy/15 pt-6">
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted">
                    {item.label}
                  </p>
                  <p className="mt-4 text-base leading-7 text-navy">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-navy/10" />

        <section id="difference" className="py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted">
                차별점
              </p>
              <h2 className="display-title mt-6 text-3xl leading-tight text-navy sm:text-4xl">
                AI 챗봇도, 튜터도,
                <br />
                생성기도 아닙니다.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-7 text-muted">
                ProofLoop는 이 셋을 잇는 연결 조직에 가깝습니다. 학생이 남긴 흔적이 그대로 교사 준비의 입력이
                되도록 한 줄로 이어 둔 것이 핵심입니다.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="divide-y divide-navy/10 border-y border-navy/10">
                {differentiators.map((row) => (
                  <li
                    key={row.label}
                    className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-10"
                  >
                    <p className="text-sm font-semibold text-muted sm:w-48">
                      {row.label}
                    </p>
                    <p className="flex-1 text-base leading-7 text-navy">{row.copy}</p>
                  </li>
                ))}
                <li className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-10">
                  <p className="text-sm font-semibold text-navy sm:w-48">ProofLoop</p>
                  <p className="flex-1 text-base leading-7 text-navy">
                    교과서 범위에 고정된 학생 챗봇과 교사 분석·생성 도구가 같은 질문 DB를 공유합니다. 학생의
                    질문이 그대로 교사 수업 준비의 입력이 됩니다.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-navy/10" />

        <section id="faq" className="py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted">
                자주 묻는 질문
              </p>
              <h2 className="display-title mt-6 text-3xl leading-tight text-navy sm:text-4xl">
                쓰기 전에 가장 많이
                <br />
                나오는 질문들.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <dl className="divide-y divide-navy/10 border-y border-navy/10">
                {faqItems.map((item) => (
                  <div key={item.q} className="py-8">
                    <dt className="text-base font-semibold text-navy">
                      {item.q}
                    </dt>
                    <dd className="mt-3 text-base leading-7 text-muted">
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-navy/10" />

        <section className="py-28">
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted">
                지금 시작하기
              </p>
              <h2 className="display-title mt-6 text-4xl leading-[1.1] text-navy sm:text-5xl">
                학생 질문과 교사 준비를
                <br />
                같은 화면 위에서.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted">
                이메일과 비밀번호로 가입하고 역할을 고르면 1분 안에 시작할 수 있습니다. 시드 교과서 데이터가
                준비되어 있어, 별도 설정 없이 전체 흐름을 바로 체험할 수 있습니다.
              </p>
            </div>
            <Link
              href="/studio/login"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              로그인 / 회원가입
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <footer className="flex flex-col items-start justify-between gap-4 border-t border-navy/10 py-10 text-xs text-muted sm:flex-row sm:items-center">
          <p>© ProofLoop · 2026 KIT Vibehackathon</p>
          <div className="flex gap-6">
            <a href="#problem" className="hover:text-navy">문제</a>
            <a href="#audience" className="hover:text-navy">사용자</a>
            <a href="#difference" className="hover:text-navy">차별점</a>
            <a href="#faq" className="hover:text-navy">FAQ</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
