"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStudio } from "@/lib/studio-context";
import { InfoBlock, SectionHeader } from "@/components/studio-ui";

export default function TeacherAnalysisPage() {
  const router = useRouter();
  const { role, currentBot, currentClusters, currentQuestionVolume, topClusters } = useStudio();

  useEffect(() => {
    if (role !== "teacher") {
      router.replace("/studio");
    }
  }, [role, router]);

  if (role !== "teacher") return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="app-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">질문 분석</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground">
                {currentBot.publisher} {currentBot.textbookName}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-navy sm:text-3xl">
              {currentBot.grade} {currentBot.subject} 질문 분석 대시보드
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
              학생이 실제로 어떤 질문을 반복하는지, 어떤 오개념이 발생하는지 데이터로 확인합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-line bg-white/72 p-4">
              <p className="text-xs font-semibold tracking-[0.08em] text-muted">누적 질문</p>
              <p className="mt-2 text-lg font-semibold text-navy">{currentQuestionVolume}회</p>
            </div>
            <div className="rounded-[22px] border border-line bg-white/72 p-4">
              <p className="text-xs font-semibold tracking-[0.08em] text-muted">상위 오개념</p>
              <p className="mt-2 text-lg font-semibold text-navy">{topClusters[0]?.misconception ?? "없음"}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        {/* Question DB */}
        <section className="app-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeader
              kicker="질문 DB"
              title="통합 질문 클러스터"
              copy="학생이 실제로 어떤 질문을 반복하는지, 어떤 오개념으로 묶이는지 바로 확인합니다."
            />
            <div className="rounded-[20px] border border-line bg-white px-4 py-3 text-sm text-muted">
              클러스터 {currentClusters.length}개
            </div>
          </div>

          <div className="app-scroll mt-6 max-h-[600px] space-y-3 overflow-y-auto pr-1">
            {currentClusters.map((cluster) => {
              const section = currentBot.sections.find((s) => s.id === cluster.sectionId);
              return (
                <div key={cluster.id} className="rounded-[22px] border border-line bg-white/72 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-navy">{cluster.representativeQuestion}</p>
                      <p className="mt-1 text-sm text-muted">
                        {section?.title ?? "단원 미지정"} / {section?.pages ?? ""}
                      </p>
                    </div>
                    <span className="rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
                      {cluster.frequency}회
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
                    <InfoBlock label="오개념 태그" value={cluster.misconception} />
                    <InfoBlock label="교사용 액션" value={cluster.teacherAction} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Textbook Range */}
        <section className="app-panel rounded-[28px] p-5 sm:p-6">
          <SectionHeader
            kicker="교과서 범위"
            title={`${currentBot.publisher} ${currentBot.textbookName}`}
            copy="학생 답변의 근거가 되는 교과서 단원과 내용입니다."
          />

          <div className="app-scroll mt-6 max-h-[600px] space-y-3 overflow-y-auto pr-1">
            {currentBot.sections.map((section) => (
              <div key={section.id} className="rounded-[22px] border border-line bg-white/72 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-navy">{section.title}</p>
                    <p className="mt-1 text-sm text-muted">{section.pages}</p>
                  </div>
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">교과서 근거</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{section.summary}</p>
                <div className="mt-4 grid gap-3">
                  <InfoBlock label="답변 기준" value={section.citationFocus} />
                  <InfoBlock label="교사용 연결 포인트" value={section.teacherBridge} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
