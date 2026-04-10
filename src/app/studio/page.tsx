"use client";

import { useRouter } from "next/navigation";
import { useStudio } from "@/lib/studio-context";

const roles = [
  {
    id: "student" as const,
    title: "학생",
    description: "교과서 범위 안에서 질문하고, 단원과 쪽수 근거가 포함된 답변을 받습니다.",
    href: "/studio/chat",
    icon: "📖",
    features: ["교과서 기반 질문·답변", "단원별 근거 확인", "후속 질문 추천"],
  },
  {
    id: "teacher" as const,
    title: "교사",
    description: "학생 질문 데이터를 분석하고, 강의 자료와 시험지 초안을 생성합니다.",
    href: "/studio/analysis",
    icon: "📋",
    features: ["질문 클러스터 분석", "오개념 트렌드 파악", "강의 자료·시험지 생성"],
  },
];

export default function StudioRoleSelect() {
  const router = useRouter();
  const { role, setRole } = useStudio();

  function handleSelect(selected: (typeof roles)[number]) {
    setRole(selected.id);
    router.push(selected.href);
  }

  // If already has role, show a re-selection prompt
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <p className="eyebrow text-xs text-muted">ProofLoop Studio</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-navy sm:text-4xl">
            어떤 역할로 시작할까요?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
            역할에 따라 사용할 수 있는 기능이 달라집니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {roles.map((r) => (
            <button
              key={r.id}
              className={`group app-panel rounded-[28px] p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                role === r.id ? "ring-2 ring-teal" : ""
              }`}
              onClick={() => handleSelect(r)}
              type="button"
            >
              <span className="text-4xl">{r.icon}</span>
              <h2 className="mt-4 text-xl font-semibold text-navy">{r.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{r.description}</p>

              <ul className="mt-4 space-y-2">
                {r.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-teal" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-full bg-navy px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors group-hover:bg-teal">
                {r.title}으로 시작
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
