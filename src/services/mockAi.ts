import { AiRecord, AppState } from "../domain/types";

export function generateOperationsBrief(state: AppState): AiRecord {
  const project = state.projects[0];
  const blocked = project.requirements.filter((requirement) => !requirement.complete).length;
  const unresolvedQa = project.qaFindings.filter((finding) => !finding.resolved).length;

  return {
    id: "ai-ops-brief",
    title: "Daily Operations Brief",
    status: "Human review required",
    confidence: 0.86,
    sources: [project.name, "Audit history", "Gate requirements", "Integration adapters"],
    body: `${project.name} is in ${project.stage}. ${blocked} gate requirements remain open and ${unresolvedQa} QA findings require attention. Recommended focus: clear onboarding evidence, resolve accessibility issues, and keep launch authorization separate from deployment execution.`
  };
}
