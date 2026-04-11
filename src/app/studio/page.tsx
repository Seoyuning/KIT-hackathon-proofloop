"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

const FADE_MS = 400;
const HOLD_MS = 500;

export default function StudioIndex() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  // Animation sequence: fade in → hold → fade out → mark done.
  useEffect(() => {
    const fadeIn = setTimeout(() => setVisible(true), 50);
    const fadeOut = setTimeout(() => setVisible(false), 50 + FADE_MS + HOLD_MS);
    const finish = setTimeout(() => setDone(true), 50 + FADE_MS + HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(finish);
    };
  }, []);

  // Redirect once both animation and auth state are ready.
  useEffect(() => {
    if (!done || isLoading) return;
    if (!user) router.replace("/studio/login");
    else if (user.role === "student") router.replace("/studio/chat");
    else router.replace("/studio/analysis");
  }, [done, user, isLoading, router]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
      <div
        className={`max-w-3xl text-center transition-all ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      >
        <p className="eyebrow text-xs text-muted">ProofLoop Studio</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] text-navy sm:text-5xl">
          교과서 위에서 연결되는
          <br />
          학생과 교사
        </h1>
        <p className="mt-5 text-base text-muted sm:text-lg">
          학생의 질문이 곧 교사의 수업이 되는 학습 스튜디오
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <FeatureCard
            icon="📖"
            title="교과서 기반 챗봇"
            desc="단원과 페이지 근거가 함께 오는 답변"
          />
          <FeatureCard
            icon="📊"
            title="통합 질문 DB"
            desc="반 전체가 어디서 막혔는지 한눈에"
          />
          <FeatureCard
            icon="📝"
            title="수업 자료 생성"
            desc="실제 학생 데이터 기반 초안"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="app-panel rounded-[22px] p-5">
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 text-sm font-semibold text-navy">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{desc}</p>
    </div>
  );
}
