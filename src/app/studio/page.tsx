import type { Metadata } from "next";
import StudioWorkbench from "@/components/studio-workbench";

export const metadata: Metadata = {
  title: "교과서 AI Studio",
  description: "학생용 교과서 챗봇과 통합 질문 DB를 기반으로 강의 자료와 시험지 초안을 만드는 화면입니다.",
};

export default function StudioPage() {
  return <StudioWorkbench />;
}
