"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "pre" | "in" | "out";

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("pre");

  useEffect(() => {
    router.prefetch("/studio/login");
    const fadeIn = requestAnimationFrame(() => setPhase("in"));
    const fadeOut = setTimeout(() => setPhase("out"), 1800);
    const redirect = setTimeout(() => router.replace("/studio/login"), 2600);
    return () => {
      cancelAnimationFrame(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <h1
        className="display-title px-6 text-center text-5xl leading-[1.05] text-navy transition-opacity duration-[800ms] ease-out sm:text-7xl lg:text-[5.5rem]"
        style={{ opacity: phase === "in" ? 1 : 0 }}
      >
        ProofLoop
      </h1>
    </main>
  );
}
