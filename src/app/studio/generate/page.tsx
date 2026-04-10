"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStudio, toggleUnit } from "@/lib/studio-context";
import { ExamQuestionCard, InfoBlock, SectionHeader, SimpleListCard, UnitToggle } from "@/components/studio-ui";

function TeacherModeButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className="app-segment rounded-[18px] px-4 py-2.5 text-sm font-semibold transition-all"
      data-active={active}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export default function TeacherGeneratePage() {
  const router = useRouter();
  const {
    role, currentBot, teacherMode, setTeacherMode,
    lessonUnitIds, setLessonUnitIds, lessonFocus, setLessonFocus, lessonMinutes, setLessonMinutes, lessonKit, handleLessonGenerate,
    examUnitIds, setExamUnitIds, examPurpose, setExamPurpose, examQuestionCount, setExamQuestionCount, examDraft, handleExamGenerate,
  } = useStudio();

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">수업 도구</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground">
                {currentBot.publisher} {currentBot.textbookName}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-navy sm:text-3xl">
              질문 DB 기반 수업 자료 생성
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
              학생 질문 데이터를 강의 자료나 시험지 초안으로 즉시 변환합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-[22px] bg-surface-strong p-1">
            <TeacherModeButton active={teacherMode === "lesson"} label="강의 자료" onClick={() => setTeacherMode("lesson")} />
            <TeacherModeButton active={teacherMode === "exam"} label="시험지 초안" onClick={() => setTeacherMode("exam")} />
          </div>
        </div>
      </header>

      {/* Lesson mode */}
      {teacherMode === "lesson" ? (
        <div className="space-y-4">
          <section className="app-panel rounded-[28px] p-5 sm:p-6">
            <SectionHeader kicker="설정" title="강의 자료 구성" copy="수업 범위와 목표를 설정하고 자료를 생성합니다." />

            <div className="mt-6 rounded-[24px] border border-line bg-white/76 p-4">
              <p className="text-sm font-semibold text-navy">수업 범위</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentBot.sections.map((section) => (
                  <UnitToggle
                    key={section.id}
                    active={lessonUnitIds.includes(section.id)}
                    label={section.title}
                    onClick={() => setLessonUnitIds((c) => toggleUnit(c, section.id))}
                  />
                ))}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-navy">수업 목표</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                    onChange={(e) => setLessonFocus(e.target.value)}
                    value={lessonFocus}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-navy">수업 시간</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                    onChange={(e) => setLessonMinutes(Number(e.target.value))}
                    value={lessonMinutes}
                  >
                    <option value={40}>40분</option>
                    <option value={45}>45분</option>
                    <option value={50}>50분</option>
                  </select>
                </label>
              </div>

              <button
                className="mt-4 inline-flex rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                onClick={handleLessonGenerate}
                type="button"
              >
                강의 자료 갱신
              </button>
            </div>
          </section>

          <section className="app-panel rounded-[28px] p-5 sm:p-6 space-y-4">
            <div className="rounded-[24px] border border-line bg-surface-strong p-4">
              <p className="text-sm font-semibold text-navy">{lessonKit.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{lessonKit.summary}</p>
            </div>

            <div className="grid gap-3">
              {lessonKit.slideOutline.map((slide) => (
                <div key={slide.title} className="rounded-[22px] border border-line bg-white/72 p-4">
                  <p className="text-sm font-semibold text-navy">{slide.title}</p>
                  <ul className="mt-3 space-y-2">
                    {slide.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm leading-6 text-muted">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-current opacity-55" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <SimpleListCard items={lessonKit.checkQuestions} title="수업 중 확인 질문" />
              <SimpleListCard items={lessonKit.teacherMemo} title="교사용 메모" />
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <section className="app-panel rounded-[28px] p-5 sm:p-6">
            <SectionHeader kicker="설정" title="시험지 구성" copy="시험 범위와 목적을 설정하고 초안을 생성합니다." />

            <div className="mt-6 rounded-[24px] border border-line bg-white/76 p-4">
              <p className="text-sm font-semibold text-navy">시험 범위</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentBot.sections.map((section) => (
                  <UnitToggle
                    key={section.id}
                    active={examUnitIds.includes(section.id)}
                    label={section.title}
                    onClick={() => setExamUnitIds((c) => toggleUnit(c, section.id))}
                  />
                ))}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-navy">시험 목적</span>
                  <input
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                    onChange={(e) => setExamPurpose(e.target.value)}
                    value={examPurpose}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-navy">문항 수</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
                    onChange={(e) => setExamQuestionCount(Number(e.target.value))}
                    value={examQuestionCount}
                  >
                    <option value={1}>1문항</option>
                    <option value={2}>2문항</option>
                    <option value={3}>3문항</option>
                  </select>
                </label>
              </div>

              <button
                className="mt-4 inline-flex rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                onClick={handleExamGenerate}
                type="button"
              >
                시험지 초안 갱신
              </button>
            </div>
          </section>

          <section className="app-panel rounded-[28px] p-5 sm:p-6 space-y-4">
            <div className="rounded-[24px] border border-line bg-surface-strong p-4">
              <p className="text-sm font-semibold text-navy">{examDraft.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{examDraft.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {examDraft.predictedTraps.map((trap) => (
                  <span key={trap} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground">
                    {trap}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {examDraft.questions.map((question) => (
                <ExamQuestionCard key={question.number} question={question} />
              ))}
            </div>

            <SimpleListCard items={examDraft.reviewNotes} title="출제 후 활용 메모" />
          </section>
        </div>
      )}
    </div>
  );
}
