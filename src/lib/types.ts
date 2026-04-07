export type DiagnosisPayload = {
  studentName: string;
  assignmentTitle: string;
  assignmentBrief: string;
  submission: string;
  aiTrace: string;
};

export type EvidenceMetric = {
  label: string;
  score: number;
  note: string;
};

export type CoachPriority = "Immediate" | "This week" | "Monitor";

export type DiagnosisMode = "live_ai" | "demo_ai";

export type DiagnosisResult = {
  mode: DiagnosisMode;
  verdict: string;
  evidenceScore: number;
  coachPriority: CoachPriority;
  strongestSignal: string;
  opportunityWindow: string;
  evidenceBreakdown: EvidenceMetric[];
  riskFlags: string[];
  misconceptions: string[];
  defenseQuestions: string[];
  interventionPlan: string[];
  studentNudge: string;
  instructorSummary: string;
};

export type DemoCase = DiagnosisPayload & {
  id: string;
  label: string;
  track: string;
  persona: string;
};

export type CohortStudent = {
  id: string;
  caseId: string;
  name: string;
  track: string;
  persona: string;
  diagnosis: DiagnosisResult;
};
