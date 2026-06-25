import { describe, expect, it } from "vitest";
import { advanceProject, completeRequirement, evaluateGate } from "../domain/lifecycle";
import { classifyRequest } from "../domain/requests";
import { createSeedState } from "../data/seed";

describe("VendorGroupOS lifecycle", () => {
  it("blocks stage advancement when onboarding evidence is missing", () => {
    const state = createSeedState();
    const result = advanceProject(state.projects[0], "Avery Chen", "Project Manager");
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("Logo, executive bios, IR contacts, transfer agent");
  });

  it("allows authorized overrides with audit evidence", () => {
    const project = createSeedState().projects[0];
    const result = advanceProject(project, "Morgan Vale", "Executive", "Client CFO approved temporary DNS workaround until IT confirms registrar.");
    expect(result.ok).toBe(true);
    expect(result.project.stage).toBe("Design");
    expect(result.project.audit[0].action).toBe("Gate override");
  });

  it("rejects unauthorized overrides", () => {
    const project = createSeedState().projects[0];
    const result = advanceProject(project, "Read Only", "Viewer", "Trying to bypass missing launch evidence.");
    expect(result.ok).toBe(false);
  });

  it("clears requirements with evidence", () => {
    const project = createSeedState().projects[0];
    const updated = completeRequirement(project, "req-onboard-assets", "Avery Chen", "Assets received from CFO.");
    expect(evaluateGate(updated)).toContain("DNS and registrar access confirmed");
    expect(updated.requirements.find((item) => item.id === "req-onboard-assets")?.complete).toBe(true);
  });
});

describe("request classification", () => {
  it("classifies support and scope work deterministically", () => {
    expect(classifyRequest("Please add an additional ROI calculator under contract")).toBe("New feature");
    expect(classifyRequest("The stock quote widget is broken")).toBe("Defect");
    expect(classifyRequest("Market open emergency outage")).toBe("Emergency issue");
  });
});
