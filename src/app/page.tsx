"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "pre" | "title" | "tagline" | "end";

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("pre");

  useEffect(() => {
    router.prefetch("/studio/login");

    const raf = requestAnimationFrame(() => setPhase("title"));
    const toTagline = setTimeout(() => setPhase("tagline"), 1500);
    const toEnd = setTimeout(() => setPhase("end"), 3000);
    const redirect = setTimeout(() => router.replace("/studio/login"), 3700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(toTagline);
      clearTimeout(toEnd);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden px-6">
      <div className="relative flex w-full max-w-4xl items-center justify-center">
        <h1
          className="display-title absolute text-center text-5xl leading-[1.05] text-navy transition-opacity duration-[700ms] ease-out sm:text-7xl lg:text-[5.5rem]"
          style={{ opacity: phase === "title" ? 1 : 0 }}
        >
          ProofLoop
        </h1>

        <p
          className="display-title absolute text-center text-3xl leading-[1.25] text-navy transition-opacity duration-[700ms] ease-out sm:text-4xl lg:text-5xl"
          style={{ opacity: phase === "tagline" ? 1 : 0 }}
        >
          학생의 질문이, 교사의 수업이 된다.
        </p>
      </div>
    </main>
  );
}
