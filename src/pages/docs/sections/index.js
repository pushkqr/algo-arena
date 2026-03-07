import StrategyBasicsSection from "./StrategyBasicsSection";
import AlgoArenaSection from "./AlgoArenaSection";
import WorkflowSection from "./WorkflowSection";
import VerificationSection from "./VerificationSection";
import MetadataSection from "./MetadataSection";
import EnvironmentsSection from "./EnvironmentsSection";
import StrategyQualitySection from "./StrategyQualitySection";
import VerificationFixesSection from "./VerificationFixesSection";
import SandboxReadingSection from "./SandboxReadingSection";
import FaqSection from "./FaqSection";
import AuctionHouse from "./environments/AuctionHouse";
import TicTacToe from "./environments/TicTacToe";

export const DOC_SECTION_COMPONENTS = {
  "algo-arena": AlgoArenaSection,
  "strategy-basics": StrategyBasicsSection,
  workflow: WorkflowSection,
  verification: VerificationSection,
  metadata: MetadataSection,
  environments: EnvironmentsSection,
  "strategy-quality": StrategyQualitySection,
  "verification-fixes": VerificationFixesSection,
  "sandbox-reading": SandboxReadingSection,
  faq: FaqSection,
};

export const DOC_ENVIRONMENT_COMPONENTS = {
  AuctionHouse,
  TicTacToe,
};
