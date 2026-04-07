"use client";

import { useMemo, useState, useTransition } from "react";
import { heuristicDiagnosis } from "@/lib/diagnosis";
import { cohortStudents, demoCases, toPayload } from "@/lib/mock-data";
import type { CohortStudent, DiagnosisPayload, DiagnosisResult, EvidenceMetric } from "@/lib/types";

const rubricMap = [
  {
    title: "기획력 및 실무 적합성",
    copy: "AI 사용이 오히려 학습을 가리는 현상은 지금 교육 현장에서 바로 생기는 문제입니다. 교강사, 수강생, 운영자 모두가 즉시 가치를 느낍니다.",
  },
  {
    title: "기술적 완성도",
    copy: "학생 진단, 위험 신호, 방어 질문, 개입 액션까지 한 흐름으로 연결했습니다. Optional live model route와 demo-safe fallback도 포함했습니다.",
  },
  {
    title: "AI 활용 능력",
    copy: "단순 챗봇이 아니라 '증거 수집 -> 이해 진단 -> 개입 설계' 파이프라인으로 AI 역할을 분리했습니다.",
  },
  {
    title: "창의성",
    copy: "기존 에듀테크가 결과물 제작을 돕는다면, ProofLoop는 AI 시대에 사라진 '이해의 증거'를 되찾는 제품입니다.",
  },
];

const aiPipeline = [
  {
    step: "01",
    title: "Evidence capture",
    copy: "과제 설명, 제출물, AI 대화 흔적을 함께 받아 결과물이 아니라 학습 과정의 신호를 수집합니다.",
  },
  {
    step: "02",
    title: "Reasoning diagnosis",
    copy: "핵심 개념 커버리지, 전이 능력, 반성적 사고, 독립적 사고를 분리 점수로 계산합니다.",
  },
  {
    step: "03",
    title: "Instructor action",
    copy: "누구를 먼저 붙잡아야 하는지, 어떤 질문을 해야 하는지, 다음 미션은 무엇인지 바로 제시합니다.",
  },
];

const navigation = [
  { href: "#studio", label: "Diagnosis Studio" },
  { href: "#radar", label: "Instructor Radar" },
  { href: "#system", label: "AI Strategy" },
];

function buildCohortStats(students: CohortStudent[]) {
  const average = Math.round(
    students.reduce((total, student) => total + student.diagnosis.evidenceScore, 0) / students.length,
  );

  const immediate = students.filter((student) => student.diagnosis.coachPriority === "Immediate").length;
  const watch = students.filter((student) => student.diagnosis.coachPriority === "This week").length;
  const strong = students.filter((student) => student.diagnosis.evidenceScore >= 80).length;

  return { average, immediate, watch, strong };
}

export default function Home() {
  const initialCase = demoCases[0];
  const [payload, setPayload] = useState<DiagnosisPayload>(toPayload(initialCase));
  const [selectedCaseId, setSelectedCaseId] = useState(initialCase.id);
  const [selectedStudentId, setSelectedStudentId] = useState(initialCase.id);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult>(cohortStudents[0].diagnosis);
  const [statusMessage, setStatusMessage] = useState("Demo AI fallback is active. Add OPENAI_API_KEY to enable live model scoring.");
  const [analysisError, setAnalysisError] = useState("");
  const [isPending, startTransition] = useTransition();

  const cohort = useMemo(() => cohortStudents, []);
  const cohortStats = useMemo(() => buildCohortStats(cohort), [cohort]);
  const selectedStudent = useMemo(
    () => cohort.find((student) => student.id === selectedStudentId) ?? cohort[0],
    [cohort, selectedStudentId],
  );

  function loadPreset(caseId: string) {
    const nextCase = demoCases.find((candidate) => candidate.id === caseId);

    if (!nextCase) {
      return;
    }

    const presetDiagnosis =
      cohort.find((student) => student.caseId === caseId)?.diagnosis ?? heuristicDiagnosis(toPayload(nextCase));

    setSelectedCaseId(caseId);
    setSelectedStudentId(caseId);
    setPayload(toPayload(nextCase));
    setDiagnosis(presetDiagnosis);
    setAnalysisError("");
    setStatusMessage(`Preset loaded: ${nextCase.studentName} / ${nextCase.persona}`);
  }

  async function runDiagnosis() {
    setAnalysisError("");
    setStatusMessage("Analyzing learning evidence...");

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Diagnosis request failed.");
      }

      const nextDiagnosis = (await response.json()) as DiagnosisResult;

      startTransition(() => {
        setDiagnosis(nextDiagnosis);
        setStatusMessage(
          nextDiagnosis.mode === "live_ai"
            ? "Live AI scoring completed."
            : "Demo AI scoring completed. Set OPENAI_API_KEY to switch to live scoring.",
        );
      });
    } catch {
      const fallback = heuristicDiagnosis(payload);

      startTransition(() => {
        setDiagnosis(fallback);
        setStatusMessage("Demo AI scoring completed. Live model was unavailable.");
      });

      setAnalysisError("Live model connection failed, so the built-in demo evaluator handled this run.");
    }
  }

  return (
    <main className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="paper-panel overflow-hidden rounded-[32px] px-5 py-5 sm:px-8 sm:py-8">
          <nav className="mb-8 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="eyebrow text-[11px] text-muted">2026 Korea IT Academy Vibe Coding Hackathon</div>
              <p className="mt-2 text-sm text-muted">
                AI가 답을 더 빨리 만들수록, 교육은 결과보다 이해의 증거를 더 정밀하게 봐야 합니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  className="pill rounded-full px-4 py-2 text-sm text-foreground transition-transform duration-200 hover:-translate-y-0.5"
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-line bg-white/50 px-4 py-2 text-xs font-medium text-muted">
                Winning concept: AI learning evidence radar for instructors
              </div>
              <div className="max-w-4xl">
                <h1 className="display-title text-5xl leading-[0.94] text-navy sm:text-6xl lg:text-7xl">
                  ProofLoop
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                  학생이 AI로 과제를 끝냈는지는 중요하지 않습니다. 더 중요한 건{" "}
                  <span className="font-semibold text-navy">AI를 쓰면서 진짜로 배웠는지</span>입니다.
                  ProofLoop는 제출물, AI 대화 흔적, 설명 수준을 함께 읽고 교강사에게 개입 순서를 알려줍니다.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard
                  label="교강사 관점"
                  value={`${cohortStats.immediate}명 즉시 개입`}
                  detail="누가 겉보기 성과만 내고 있는지 먼저 보여줍니다."
                />
                <MetricCard
                  label="학습자 관점"
                  value={`${cohortStats.average} / 100 cohort evidence`}
                  detail="완성도 대신 이해 증거를 기준으로 성장 경로를 제시합니다."
                />
                <MetricCard
                  label="운영자 관점"
                  value={`${cohortStats.watch}명 이번 주 코칭`}
                  detail="드롭아웃과 뒤늦은 학습 부채를 조기 탐지합니다."
                />
              </div>
            </div>

            <aside className="flex h-full flex-col justify-between rounded-[28px] border border-navy/10 bg-navy px-5 py-5 text-white sm:px-6">
              <div>
                <p className="eyebrow text-[11px] text-white/70">Pitch</p>
                <h2 className="mt-4 text-2xl font-semibold leading-tight">
                  기존 AI 교육 솔루션은 학생을 더 빨리 끝내게 합니다.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  ProofLoop는 교강사가{" "}
                  <span className="font-semibold text-white">누가 진짜 이해했고 누가 숨은 학습 부채를 만들고 있는지</span>{" "}
                  보게 만듭니다. LMS가 아니라, AI 시대에 새로 생긴 교육 문제를 정면으로 겨냥한 레이더입니다.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {rubricMap.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/74">{item.copy}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <InsightCard
            title="Pain point"
            copy="AI로 숙제를 끝낸 학생은 많아졌지만, 교강사는 그 학생이 실제로 이해했는지 볼 수 없습니다."
          />
          <InsightCard
            title="Why now"
            copy="튜터, 채점기, 강의 생성기는 이미 많습니다. 지금 비어 있는 영역은 '이해 검증'과 '즉시 개입 우선순위'입니다."
          />
          <InsightCard
            title="Narrow wedge"
            copy="코딩 교육 기관의 교강사 대시보드부터 시작합니다. 과제 결과와 AI 사용 흔적이 가장 많이 충돌하는 현장입니다."
          />
        </section>

        <section id="studio" className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="Diagnosis Studio"
              title="학생 한 명의 숨은 학습 부채를 1분 안에 드러냅니다."
              copy="프리셋으로 데모를 바로 돌리거나, 실제 제출물과 AI 대화 흔적을 넣어 새로운 진단을 생성하세요."
            />

            <div className="mt-6 flex flex-wrap gap-2">
              {demoCases.map((demoCase) => (
                <button
                  key={demoCase.id}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    selectedCaseId === demoCase.id
                      ? "border-transparent bg-navy text-white shadow-lg"
                      : "border-line bg-white/65 text-foreground hover:-translate-y-0.5"
                  }`}
                  onClick={() => loadPreset(demoCase.id)}
                  type="button"
                >
                  {demoCase.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="학생 이름"
                value={payload.studentName}
                onChange={(value) => setPayload((current) => ({ ...current, studentName: value }))}
              />
              <Field
                label="과제명"
                value={payload.assignmentTitle}
                onChange={(value) => setPayload((current) => ({ ...current, assignmentTitle: value }))}
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="과제 설명"
                value={payload.assignmentBrief}
                onChange={(value) => setPayload((current) => ({ ...current, assignmentBrief: value }))}
                rows={5}
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="학생 제출물 또는 설명"
                value={payload.submission}
                onChange={(value) => setPayload((current) => ({ ...current, submission: value }))}
                rows={7}
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="AI 대화 흔적"
                value={payload.aiTrace}
                onChange={(value) => setPayload((current) => ({ ...current, aiTrace: value }))}
                rows={5}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-navy">{statusMessage}</p>
                {analysisError ? <p className="mt-1 text-sm text-red">{analysisError}</p> : null}
              </div>

              <button
                className="inline-flex items-center justify-center rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isPending}
                onClick={() => void runDiagnosis()}
                type="button"
              >
                {isPending ? "Analyzing..." : "Run ProofLoop"}
              </button>
            </div>
          </div>

          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="Diagnosis Result"
              title={diagnosis.verdict}
              copy={diagnosis.instructorSummary}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-[0.72fr_1.28fr]">
              <div className="rounded-[28px] border border-line bg-white/62 p-5">
                <ScoreDial score={diagnosis.evidenceScore} />
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-navy px-4 py-3 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">Coach priority</p>
                    <p className="mt-1 text-sm font-semibold">{diagnosis.coachPriority}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    {diagnosis.mode === "live_ai" ? "Live AI" : "Demo AI"}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{diagnosis.opportunityWindow}</p>
              </div>

              <div className="grid gap-3">
                {diagnosis.evidenceBreakdown.map((metric) => (
                  <EvidenceRow key={metric.label} metric={metric} />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <ListCard
                title="Risk flags"
                items={diagnosis.riskFlags}
                tone="warn"
              />
              <ListCard
                title="Likely misconceptions"
                items={diagnosis.misconceptions}
                tone="default"
              />
              <ListCard
                title="Adaptive defense questions"
                items={diagnosis.defenseQuestions}
                tone="default"
              />
              <ListCard
                title="Next instructor actions"
                items={diagnosis.interventionPlan}
                tone="accent"
              />
            </div>

            <div className="mt-4 rounded-[24px] border border-teal/20 bg-teal/8 p-4">
              <p className="text-sm font-semibold text-navy">Student nudge</p>
              <p className="mt-2 text-sm leading-6 text-muted">{diagnosis.studentNudge}</p>
            </div>
          </div>
        </section>

        <section id="radar" className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
          <SectionHeader
            kicker="Instructor Radar"
            title="한 반 전체를 한눈에 보고, 누구를 먼저 붙잡을지 결정합니다."
            copy="학생별 결과물이 아니라 학습 증거 밀도와 개입 우선순위를 기준으로 코칭 순서를 재정렬합니다."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard
                label="Cohort average"
                value={`${cohortStats.average} / 100`}
                detail="반 전체의 학습 증거 평균"
              />
              <MetricCard
                label="Immediate"
                value={`${cohortStats.immediate} learners`}
                detail="이번 수업 안에 구두 검증이 필요한 학생"
              />
              <MetricCard
                label="Ready to mentor"
                value={`${cohortStats.strong} learners`}
                detail="추가 stretch task나 peer support 가능"
              />
            </div>

            <div className="grid gap-3">
              {cohort
                .slice()
                .sort((left, right) => {
                  const priorityRank = { Immediate: 0, "This week": 1, Monitor: 2 } as const;
                  return (
                    priorityRank[left.diagnosis.coachPriority] - priorityRank[right.diagnosis.coachPriority] ||
                    left.diagnosis.evidenceScore - right.diagnosis.evidenceScore
                  );
                })
                .map((student) => (
                  <button
                    key={student.id}
                    className={`w-full rounded-[24px] border p-4 text-left transition-transform duration-200 ${
                      selectedStudent.id === student.id
                        ? "border-transparent bg-navy text-white shadow-lg"
                        : "border-line bg-white/62 hover:-translate-y-0.5"
                    }`}
                    onClick={() => setSelectedStudentId(student.id)}
                    type="button"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold">{student.name}</p>
                        <p
                          className={`mt-1 text-sm ${
                            selectedStudent.id === student.id ? "text-white/72" : "text-muted"
                          }`}
                        >
                          {student.track} / {student.persona}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <PriorityBadge priority={student.diagnosis.coachPriority} inverted={selectedStudent.id === student.id} />
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            selectedStudent.id === student.id
                              ? "bg-white/10 text-white"
                              : "bg-white text-foreground"
                          }`}
                        >
                          Evidence {student.diagnosis.evidenceScore}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-line bg-white/72 p-5">
            <p className="eyebrow text-[11px] text-muted">Selected student</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-2xl font-semibold text-navy">{selectedStudent.name}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {selectedStudent.track} / {selectedStudent.persona}
                </p>
                <div className="mt-4">
                  <PriorityBadge priority={selectedStudent.diagnosis.coachPriority} />
                </div>
              </div>

              <div className="grid gap-3">
                <InsightMiniCard title="Strongest signal" copy={selectedStudent.diagnosis.strongestSignal} />
                <InsightMiniCard title="Opportunity window" copy={selectedStudent.diagnosis.opportunityWindow} />
                <InsightMiniCard title="Coach move" copy={selectedStudent.diagnosis.interventionPlan[0]} />
              </div>
            </div>
          </div>
        </section>

        <section id="system" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="AI Strategy"
              title="심사위원이 보기 쉬운 AI 활용 구조"
              copy="모델 하나에 모든 걸 맡기지 않고, 단계별 역할과 fallback을 분리해 안정성과 설득력을 확보했습니다."
            />

            <div className="mt-6 grid gap-3">
              {aiPipeline.map((item) => (
                <div key={item.step} className="rounded-[24px] border border-line bg-white/65 p-4">
                  <div className="flex items-center gap-3">
                    <span className="eyebrow text-[11px] text-muted">{item.step}</span>
                    <p className="text-lg font-semibold text-navy">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="Submission Angle"
              title="AI 리포트에 바로 옮겨 적을 핵심 메시지"
              copy="문제 정의, 핵심 기능, 기대 효과, AI 활용 전략이 한 문장씩 연결되게 구성했습니다."
            />

            <div className="mt-6 space-y-4">
              <SummaryBlock
                title="Problem"
                copy="AI 사용으로 과제 완성 속도는 빨라졌지만, 교강사는 학습자가 실제로 이해했는지 판단하기 더 어려워졌습니다."
              />
              <SummaryBlock
                title="Core feature"
                copy="제출물과 AI 대화 흔적을 함께 읽어 이해 증거 점수, 구두 방어 질문, 개입 우선순위, 다음 미션을 생성합니다."
              />
              <SummaryBlock
                title="Expected outcome"
                copy="학습 부채를 조기에 발견해 오답 누적, 허수 성과, 뒤늦은 이탈을 줄이고 교강사의 피드백 시간을 더 전략적으로 씁니다."
              />
              <SummaryBlock
                title="Operational edge"
                copy="Optional live AI route가 꺼져도 데모가 동작하므로 배포 안정성을 해치지 않습니다. 공개 저장소와 심사 데모에 유리합니다."
              />
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
      <p className="eyebrow text-[11px] text-muted">{kicker}</p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">{copy}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[26px] border border-line bg-white/68 p-4">
      <p className="eyebrow text-[10px] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-navy">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

function InsightCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="paper-panel rounded-[26px] px-5 py-5">
      <p className="eyebrow text-[10px] text-muted">{title}</p>
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-navy">{label}</span>
      <input
        className="w-full rounded-2xl border border-line bg-white/82 px-4 py-3 text-sm outline-none transition-colors focus:border-teal"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-navy">{label}</span>
      <textarea
        className="w-full rounded-[24px] border border-line bg-white/82 px-4 py-3 text-sm leading-7 outline-none transition-colors focus:border-teal"
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function ScoreDial({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-line bg-[radial-gradient(circle_at_top,_rgba(11,143,128,0.12),_transparent_58%)] px-4 py-6">
      <div
        className="flex h-36 w-36 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(var(--teal) ${score * 3.6}deg, rgba(16, 32, 51, 0.08) 0deg)`,
        }}
      >
        <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-surface-strong">
          <span className="eyebrow text-[10px] text-muted">Evidence</span>
          <span className="mt-2 text-4xl font-semibold text-navy">{score}</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm leading-6 text-muted">
        High score means the learner can explain, adapt, and defend the work, not just ship it.
      </p>
    </div>
  );
}

function EvidenceRow({ metric }: { metric: EvidenceMetric }) {
  return (
    <div className="rounded-[24px] border border-line bg-white/68 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-navy">{metric.label}</p>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground">
          {metric.score}
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-navy/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal to-orange"
          style={{ width: `${metric.score}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{metric.note}</p>
    </div>
  );
}

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "default" | "warn" | "accent";
}) {
  const toneStyles =
    tone === "warn"
      ? "border-red/22 bg-red/6"
      : tone === "accent"
        ? "border-teal/22 bg-teal/7"
        : "border-line bg-white/68";

  return (
    <div className={`rounded-[26px] border p-4 ${toneStyles}`}>
      <p className="text-sm font-semibold text-navy">{title}</p>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriorityBadge({
  priority,
  inverted = false,
}: {
  priority: DiagnosisResult["coachPriority"];
  inverted?: boolean;
}) {
  const palette =
    priority === "Immediate"
      ? inverted
        ? "bg-red/18 text-white"
        : "bg-red/10 text-red"
      : priority === "This week"
        ? inverted
          ? "bg-amber/18 text-white"
          : "bg-amber/18 text-navy"
        : inverted
          ? "bg-teal/18 text-white"
          : "bg-teal/10 text-teal";

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${palette}`}>{priority}</span>;
}

function InsightMiniCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[22px] border border-line bg-surface-strong p-4">
      <p className="text-sm font-semibold text-navy">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
    </div>
  );
}
