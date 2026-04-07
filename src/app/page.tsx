"use client";

import { useMemo, useState } from "react";
import { heuristicDiagnosis } from "@/lib/diagnosis";
import { cohortStudents, demoCases, toPayload } from "@/lib/mock-data";
import { getPayloadValidationMessage } from "@/lib/payload-validation";
import type { CohortStudent, DiagnosisPayload, DiagnosisResult, EvidenceMetric } from "@/lib/types";

const rubricMap = [
  {
    title: "기획력 및 실무 적합성",
    copy: "AI 활용이 오히려 학습을 가리는 현상은 지금 교육 현장에서 바로 생기는 문제입니다. 교강사, 수강생, 운영자 모두가 즉시 가치를 느낄 수 있습니다.",
  },
  {
    title: "기술적 완성도",
    copy: "학생 진단, 위험 신호, 구두 확인 질문, 개입 액션까지 한 흐름으로 연결했습니다. 실시간 AI와 데모 안전 fallback도 함께 설계했습니다.",
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
    title: "증거 수집",
    copy: "과제 설명, 제출물, AI 대화 흔적을 함께 받아 결과물이 아니라 학습 과정의 신호를 수집합니다.",
  },
  {
    step: "02",
    title: "이해 진단",
    copy: "핵심 개념 커버리지, 전이 능력, 반성적 사고, 독립적 사고를 분리 점수로 계산합니다.",
  },
  {
    step: "03",
    title: "개입 설계",
    copy: "누구를 먼저 붙잡아야 하는지, 어떤 질문을 해야 하는지, 다음 미션은 무엇인지 바로 제시합니다.",
  },
];

const navigation = [
  { href: "#studio", label: "진단 스튜디오" },
  { href: "#radar", label: "교강사 레이더" },
  { href: "#system", label: "AI 전략" },
];

const evidenceLabelMap: Record<string, string> = {
  "Concept coverage": "핵심 개념 이해",
  "Transfer ability": "전이 및 응용",
  "Reflection depth": "설명과 반성 깊이",
  "Independent thinking": "독립적 사고",
};

const coachPriorityMap: Record<DiagnosisResult["coachPriority"], string> = {
  Immediate: "즉시 개입",
  "This week": "이번 주 코칭",
  Monitor: "경과 관찰",
};

function formatEvidenceLabel(label: string) {
  return evidenceLabelMap[label] ?? label;
}

function formatCoachPriority(priority: DiagnosisResult["coachPriority"]) {
  return coachPriorityMap[priority];
}

function formatDiagnosisMode(mode: DiagnosisResult["mode"]) {
  return mode === "live_ai" ? "실시간 AI" : "데모 안전 모드";
}

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
  const [statusMessage, setStatusMessage] = useState(
    "프리셋을 고르거나 실제 제출물을 붙여 넣은 뒤, ProofLoop 진단을 실행하세요.",
  );
  const [analysisError, setAnalysisError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cohort = useMemo(() => cohortStudents, []);
  const cohortStats = useMemo(() => buildCohortStats(cohort), [cohort]);
  const selectedStudent = useMemo(
    () => cohort.find((student) => student.id === selectedStudentId) ?? cohort[0],
    [cohort, selectedStudentId],
  );
  const validationMessage = useMemo(() => getPayloadValidationMessage(payload), [payload]);

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
    setStatusMessage(`프리셋 불러옴: ${nextCase.studentName} · ${nextCase.persona}`);
  }

  async function runDiagnosis() {
    const nextValidationMessage = getPayloadValidationMessage(payload);

    if (nextValidationMessage) {
      setAnalysisError(nextValidationMessage);
      setStatusMessage("진단에 필요한 학습 증거를 조금 더 입력해 주세요.");
      return;
    }

    setAnalysisError("");
    setStatusMessage("학습 증거를 분석하고 있습니다...");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | DiagnosisResult
        | { error?: string }
        | null;

      if (!response.ok) {
        const errorMessage =
          responseBody &&
          typeof responseBody === "object" &&
          "error" in responseBody &&
          typeof responseBody.error === "string"
            ? responseBody.error
            : "진단 요청 처리에 실패했습니다.";

        setAnalysisError(errorMessage);
        setStatusMessage("입력 내용을 보강한 뒤 다시 진단해 주세요.");
        return;
      }

      const nextDiagnosis = responseBody as DiagnosisResult;

      setDiagnosis(nextDiagnosis);
      setStatusMessage(
        nextDiagnosis.mode === "live_ai"
          ? "실시간 AI 분석이 완료되었습니다."
          : "데모 안전 모드로 진단이 완료되었습니다. 실시간 모델이 불안정해도 발표는 계속할 수 있습니다.",
      );
    } catch {
      const fallback = heuristicDiagnosis(payload);

      setDiagnosis(fallback);
      setStatusMessage("데모 안전 모드로 진단이 완료되었습니다.");
      setAnalysisError("실시간 모델 연결이 불안정해 내장 평가기가 대신 실행되었습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="paper-panel overflow-hidden rounded-[32px] px-5 py-5 sm:px-8 sm:py-8">
          <nav className="mb-8 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="eyebrow text-xs text-muted">2026 Korea IT Academy Vibe Coding Hackathon</div>
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
                해커톤 제안작 | 교강사를 위한 AI 학습 증거 레이더
              </div>
              <div className="max-w-4xl">
                <h1 className="display-title text-5xl leading-[0.94] text-navy sm:text-6xl lg:text-7xl">
                  ProofLoop
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                  학생이 AI로 과제를 끝냈는지는 중요하지 않습니다. 더 중요한 건{" "}
                  <span className="font-semibold text-navy">AI를 쓰면서 실제로 이해했는지</span>입니다.
                  ProofLoop는 제출물, AI 대화 흔적, 설명 수준을 함께 읽고 교강사에게 개입 순서와 확인 질문을 알려줍니다.
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
                  value={`${cohortStats.average} / 100 이해 증거`}
                  detail="완성도 대신 이해 증거를 기준으로 성장 경로를 보여줍니다."
                />
                <MetricCard
                  label="운영자 관점"
                  value={`${cohortStats.watch}명 이번 주 코칭`}
                  detail="중도 이탈과 뒤늦은 학습 부채를 조기에 탐지합니다."
                />
              </div>
            </div>

            <aside className="flex h-full flex-col justify-between rounded-[28px] border border-navy/10 bg-navy px-5 py-5 text-white sm:px-6">
              <div>
                <p className="eyebrow text-xs text-white/70">핵심 제안</p>
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
            title="문제 정의"
            copy="AI로 숙제를 끝낸 학생은 많아졌지만, 교강사는 그 학생이 실제로 이해했는지 볼 수 없습니다."
          />
          <InsightCard
            title="왜 지금인가"
            copy="튜터, 채점기, 강의 생성기는 이미 많습니다. 지금 비어 있는 영역은 '이해 검증'과 '즉시 개입 우선순위'입니다."
          />
          <InsightCard
            title="첫 적용 현장"
            copy="코딩 교육 기관의 교강사 대시보드부터 시작합니다. 과제 결과와 AI 사용 흔적이 가장 많이 충돌하는 현장입니다."
          />
        </section>

        <section id="studio" className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="진단 스튜디오"
              title="학생 한 명의 숨은 학습 부채를 1분 안에 드러냅니다."
              copy="프리셋으로 데모를 바로 돌리거나, 실제 제출물과 AI 대화 흔적을 넣어 새로운 진단을 생성하세요."
            />

            <div className="mt-6 rounded-[22px] border border-teal/18 bg-teal/7 px-4 py-3">
              <p className="text-sm font-semibold text-navy">빠른 시작 가이드</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                발표에서는 프리셋을 눌러 즉시 시연하고, 실제 베타 테스트에서는 학생 설명과 AI 대화 흔적을 함께 붙여 넣으면 더 정확한 진단이 나옵니다.
              </p>
            </div>

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
                helper="실제 학생 이름이나 발표용 가명을 넣으세요."
                placeholder="예: 민준"
                value={payload.studentName}
                onChange={(value) => setPayload((current) => ({ ...current, studentName: value }))}
              />
              <Field
                label="과제명"
                helper="교강사가 바로 맥락을 이해할 수 있게 과제명을 적으세요."
                placeholder="예: React 상태 흐름 디버깅"
                value={payload.assignmentTitle}
                onChange={(value) => setPayload((current) => ({ ...current, assignmentTitle: value }))}
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="과제 설명"
                helper="요구사항, 필수 개념, 평가 포인트를 포함해 주세요."
                placeholder="예: optimistic update, rollback, race condition을 설명해야 하는 과제입니다."
                value={payload.assignmentBrief}
                onChange={(value) => setPayload((current) => ({ ...current, assignmentBrief: value }))}
                rows={5}
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="학생 제출물 또는 설명"
                helper="학생이 실제로 제출한 글, 발표 대본, 코드 설명을 붙여 넣으세요."
                placeholder="예: 좋아요 수를 부모 상태로 올린 이유는 목록 정렬과 동기화가 깨질 수 있기 때문입니다..."
                value={payload.submission}
                onChange={(value) => setPayload((current) => ({ ...current, submission: value }))}
                rows={7}
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="AI 대화 흔적"
                helper="가능하면 학생이 AI에 던진 질문을 그대로 넣으세요. 없다면 비워도 됩니다."
                placeholder="예: 제 풀이의 약한 부분 2개만 지적해 주세요. requestId 방식 말고 대안이 있는지도 비교해 주세요."
                value={payload.aiTrace}
                onChange={(value) => setPayload((current) => ({ ...current, aiTrace: value }))}
                rows={5}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-navy">{statusMessage}</p>
                {analysisError ? <p className="mt-1 text-sm text-red">{analysisError}</p> : null}
                {!analysisError && validationMessage ? (
                  <p className="mt-1 text-sm text-muted">{validationMessage}</p>
                ) : null}
              </div>

              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                disabled={isSubmitting || Boolean(validationMessage)}
                onClick={() => void runDiagnosis()}
                type="button"
              >
                {isSubmitting ? "진단 중..." : validationMessage ? "입력 보강 필요" : "ProofLoop 실행"}
              </button>
            </div>
          </div>

          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="진단 결과"
              title={diagnosis.verdict}
              copy={diagnosis.instructorSummary}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-[0.72fr_1.28fr]">
              <div className="rounded-[28px] border border-line bg-white/62 p-5">
                <ScoreDial score={diagnosis.evidenceScore} />
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-navy px-4 py-3 text-white">
                  <div>
                    <p className="text-xs tracking-[0.12em] text-white/60">개입 우선순위</p>
                    <p className="mt-1 text-sm font-semibold">{formatCoachPriority(diagnosis.coachPriority)}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    {formatDiagnosisMode(diagnosis.mode)}
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
                title="위험 신호"
                items={diagnosis.riskFlags}
                tone="warn"
              />
              <ListCard
                title="예상 오개념"
                items={diagnosis.misconceptions}
                tone="default"
              />
              <ListCard
                title="구두 확인 질문"
                items={diagnosis.defenseQuestions}
                tone="default"
              />
              <ListCard
                title="다음 개입 액션"
                items={diagnosis.interventionPlan}
                tone="accent"
              />
            </div>

            <div className="mt-4 rounded-[24px] border border-teal/20 bg-teal/8 p-4">
              <p className="text-sm font-semibold text-navy">학습자 한 줄 피드백</p>
              <p className="mt-2 text-sm leading-6 text-muted">{diagnosis.studentNudge}</p>
            </div>
          </div>
        </section>

        <section id="radar" className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
          <SectionHeader
            kicker="교강사 레이더"
            title="한 반 전체를 한눈에 보고, 누구를 먼저 붙잡을지 결정합니다."
            copy="학생별 결과물이 아니라 학습 증거 밀도와 개입 우선순위를 기준으로 코칭 순서를 재정렬합니다."
          />

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard
                label="반 평균"
                value={`${cohortStats.average} / 100`}
                detail="반 전체의 이해 증거 평균"
              />
              <MetricCard
                label="즉시 개입"
                value={`${cohortStats.immediate}명`}
                detail="이번 수업 안에 구두 검증이 필요한 학생"
              />
              <MetricCard
                label="확장 과제 가능"
                value={`${cohortStats.strong}명`}
                detail="추가 과제나 피어 서포트가 가능한 학생"
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
                          증거 점수 {student.diagnosis.evidenceScore}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-line bg-white/72 p-5">
            <p className="eyebrow text-xs text-muted">선택한 학습자</p>
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
                <InsightMiniCard title="가장 강한 신호" copy={selectedStudent.diagnosis.strongestSignal} />
                <InsightMiniCard title="지금 개입해야 하는 이유" copy={selectedStudent.diagnosis.opportunityWindow} />
                <InsightMiniCard title="교강사 첫 액션" copy={selectedStudent.diagnosis.interventionPlan[0]} />
              </div>
            </div>
          </div>
        </section>

        <section id="system" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="paper-panel rounded-[30px] px-5 py-5 sm:px-6">
            <SectionHeader
              kicker="AI 전략"
              title="심사위원이 보기 쉬운 AI 활용 구조"
              copy="모델 하나에 모든 걸 맡기지 않고, 단계별 역할과 fallback을 분리해 안정성과 설득력을 확보했습니다."
            />

            <div className="mt-6 grid gap-3">
              {aiPipeline.map((item) => (
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
              kicker="제출 포인트"
              title="AI 리포트에 바로 옮겨 적을 핵심 메시지"
              copy="문제 정의, 핵심 기능, 기대 효과, AI 활용 전략이 한 문장씩 연결되게 구성했습니다."
            />

            <div className="mt-6 space-y-4">
              <SummaryBlock
                title="문제"
                copy="AI 사용으로 과제 완성 속도는 빨라졌지만, 교강사는 학습자가 실제로 이해했는지 판단하기 더 어려워졌습니다."
              />
              <SummaryBlock
                title="핵심 기능"
                copy="제출물과 AI 대화 흔적을 함께 읽어 이해 증거 점수, 구두 방어 질문, 개입 우선순위, 다음 미션을 생성합니다."
              />
              <SummaryBlock
                title="기대 효과"
                copy="학습 부채를 조기에 발견해 오답 누적, 허수 성과, 뒤늦은 이탈을 줄이고 교강사의 피드백 시간을 더 전략적으로 씁니다."
              />
              <SummaryBlock
                title="운영 강점"
                copy="실시간 AI 경로가 불안정해도 데모 안전 모드가 계속 동작하므로 배포 안정성을 해치지 않습니다. 공개 저장소와 심사 데모에 모두 유리합니다."
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
      <p className="eyebrow text-xs text-muted">{kicker}</p>
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
      <p className="eyebrow text-xs text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-navy">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

function InsightCard({ title, copy }: { title: string; copy: string }) {
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

function Field({
  label,
  helper,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  helper?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-navy">{label}</span>
      {helper ? <span className="mb-2 block text-xs leading-5 text-muted">{helper}</span> : null}
      <input
        className="w-full rounded-2xl border border-line bg-white/82 px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted/72 focus:border-teal"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function TextArea({
  label,
  helper,
  placeholder,
  value,
  onChange,
  rows,
}: {
  label: string;
  helper?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-navy">{label}</span>
      {helper ? <span className="mb-2 block text-xs leading-5 text-muted">{helper}</span> : null}
      <textarea
        className="w-full rounded-[24px] border border-line bg-white/82 px-4 py-3 text-sm leading-7 outline-none transition-colors placeholder:text-muted/72 focus:border-teal"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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
          <span className="eyebrow text-xs text-muted">이해 증거</span>
          <span className="mt-2 text-4xl font-semibold text-navy">{score}</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm leading-6 text-muted">
        점수가 높을수록 결과물만 만든 것이 아니라, 왜 그렇게 했는지 설명하고 바꿔서 적용할 수 있다는 뜻입니다.
      </p>
    </div>
  );
}

function EvidenceRow({ metric }: { metric: EvidenceMetric }) {
  return (
    <div className="rounded-[24px] border border-line bg-white/68 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-navy">{formatEvidenceLabel(metric.label)}</p>
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
          <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-current opacity-55" />
            <span>{item}</span>
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

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${palette}`}>{formatCoachPriority(priority)}</span>;
}

function InsightMiniCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[22px] border border-line bg-surface-strong p-4">
      <p className="text-sm font-semibold text-navy">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
    </div>
  );
}
