import { AuditEvent, Project, Role, Stage, stages } from "./types";

const overrideRoles: Role[] = ["Executive", "Project Manager", "QA Lead"];

export interface TransitionResult {
  ok: boolean;
  project: Project;
  missing: string[];
  message: string;
}

export function canOverride(role: Role) {
  return overrideRoles.includes(role);
}

export function evaluateGate(project: Project): string[] {
  const missing = project.requirements
    .filter((requirement) => requirement.stage === project.stage && !requirement.complete)
    .map((requirement) => requirement.label);

  if (project.stage === "Launch Authorization") {
    if (project.qaFindings.some((finding) => !finding.resolved && ["High", "Critical"].includes(finding.severity))) {
      missing.push("Resolve high and critical QA findings");
    }
    if (!project.launchAuthorized) missing.push("Client launch authorization");
    if (!project.deploymentPrepared) missing.push("Deployment preparation");
  }

  if (project.stage === "Launch" && !project.smokeTestPassed) {
    missing.push("Post-launch smoke test");
  }

  if (project.stage === "Post-Launch" && !project.debriefComplete) {
    missing.push("Post-launch debrief");
  }

  return missing;
}

export function nextStage(stage: Stage): Stage | null {
  const index = stages.indexOf(stage);
  return index >= 0 && index < stages.length - 1 ? stages[index + 1] : null;
}

export function audit(actor: string, action: string, detail: string): AuditEvent {
  return {
    id: crypto.randomUUID(),
    actor,
    action,
    detail,
    timestamp: new Date().toISOString()
  };
}

export function advanceProject(project: Project, actor: string, role: Role, overrideReason?: string): TransitionResult {
  const target = nextStage(project.stage);
  if (!target) {
    return { ok: false, project, missing: [], message: "Project is already at the final lifecycle stage." };
  }

  const missing = evaluateGate(project);
  const override = missing.length > 0 && Boolean(overrideReason);

  if (missing.length > 0 && !override) {
    return { ok: false, project, missing, message: "Gate blocked because required evidence is missing." };
  }

  if (override && (!canOverride(role) || !overrideReason || overrideReason.trim().length < 12)) {
    return {
      ok: false,
      project,
      missing,
      message: "Override requires an authorized role and a risk-aware reason of at least 12 characters."
    };
  }

  const updated: Project = {
    ...project,
    stage: target,
    health: missing.length > 0 ? "Watch" : "Healthy",
    audit: [
      audit(
        actor,
        override ? "Gate override" : "Gate passed",
        override ? `${project.stage} -> ${target}: ${overrideReason}. Missing: ${missing.join(", ")}` : `${project.stage} -> ${target}`
      ),
      ...project.audit
    ],
    tasks: project.tasks.map((task) => (task.owner === project.owner && target === "Development" ? { ...task, done: false } : task))
  };

  return { ok: true, project: updated, missing, message: override ? "Override recorded and project advanced." : "Project advanced." };
}

export function completeRequirement(project: Project, requirementId: string, actor: string, evidence: string): Project {
  return {
    ...project,
    requirements: project.requirements.map((requirement) =>
      requirement.id === requirementId ? { ...requirement, complete: true, evidence } : requirement
    ),
    audit: [audit(actor, "Requirement completed", evidence), ...project.audit]
  };
}

export function resolveFinding(project: Project, findingId: string, actor: string): Project {
  return {
    ...project,
    qaFindings: project.qaFindings.map((finding) => (finding.id === findingId ? { ...finding, resolved: true } : finding)),
    audit: [audit(actor, "QA finding resolved", findingId), ...project.audit]
  };
}
