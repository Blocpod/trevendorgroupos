import { RequestClass } from "./types";

export function classifyRequest(text: string): RequestClass {
  const value = text.toLowerCase();
  if (/(down|outage|breach|urgent|market open|emergency)/.test(value)) return "Emergency issue";
  if (/(bug|broken|defect|error|not working)/.test(value)) return "Defect";
  if (/(typo|correction|incorrect)/.test(value)) return "Correction";
  if (/(revise|revision|included)/.test(value)) return "Included revision";
  if (/(copy|bio|press release|content|update)/.test(value)) return "Content update";
  if (/(new feature|calculator|portal|integration)/.test(value)) return "New feature";
  if (/(scope|additional|contract|change order)/.test(value)) return "Scope expansion";
  if (/(phase|later|roadmap)/.test(value)) return "Future phase";
  return "Support request";
}
