import { AppState, GateRequirement, Project } from "../domain/types";
import { generateOperationsBrief } from "../services/mockAi";

const requirements: GateRequirement[] = [
  { id: "req-finance", stage: "Finance", label: "Signed proposal and billing profile", complete: true, evidence: "Flat-rate managed hosting and rebuild SOW approved." },
  { id: "req-onboard-assets", stage: "Onboarding", label: "Logo, executive bios, IR contacts, transfer agent", complete: false },
  { id: "req-onboard-access", stage: "Onboarding", label: "DNS and registrar access confirmed", complete: false },
  { id: "req-design-approval", stage: "Design", label: "Client design approval", complete: true, evidence: "Design board approved by CFO." },
  { id: "req-handoff", stage: "Development", label: "Design-to-development handoff complete", complete: true, evidence: "Components, sitemap, and CMS model reviewed." },
  { id: "req-iqa", stage: "Internal QA", label: "Internal QA pass", complete: false },
  { id: "req-clientqa", stage: "Client QA", label: "Client QA approval", complete: false },
  { id: "req-launch-auth", stage: "Launch Authorization", label: "Launch authorization signed by client", complete: false },
  { id: "req-debrief", stage: "Post-Launch", label: "Debrief converted to improvement proposal", complete: false }
];

const meridianProject: Project = {
  id: "project-marx-rebuild",
  clientId: "client-meridian",
  name: "Corporate and Investor Relations Website Rebuild",
  stage: "Onboarding",
  health: "Blocked",
  owner: "Project Manager",
  requirements,
  tasks: [
    { id: "task-sitemap", label: "Finalize IR sitemap and governance taxonomy", owner: "Project Manager", due: "2026-07-01", done: true },
    { id: "task-sec", label: "Validate SEC filing feed adapter", owner: "Developer", due: "2026-07-03", done: false },
    { id: "task-a11y", label: "Resolve keyboard focus issue in quote widget", owner: "QA Lead", due: "2026-07-05", done: false },
    { id: "task-auth", label: "Collect named launch authorization", owner: "Client Success", due: "2026-07-08", done: false }
  ],
  requests: [
    {
      id: "wr-1",
      title: "Replace leadership bio copy",
      description: "CFO sent updated public bio and headshot.",
      classification: "Content update",
      severity: "Low",
      complianceSensitive: true,
      owner: "Project Manager",
      due: "2026-07-02",
      status: "In review",
      approval: "Human review required"
    },
    {
      id: "wr-2",
      title: "Add inspection robotics ROI calculator",
      description: "Client asked for a new calculator after design approval.",
      classification: "Scope expansion",
      severity: "Medium",
      complianceSensitive: false,
      owner: "Executive",
      due: "2026-07-10",
      status: "Escalated",
      approval: "Draft"
    }
  ],
  assets: [
    { id: "asset-logo", label: "Approved vector logo", status: "Received", owner: "Marketing" },
    { id: "asset-bios", label: "Executive biographies", status: "Missing", owner: "Client CFO" },
    { id: "asset-domain", label: "Registrar delegation", status: "Missing", owner: "Client IT" },
    { id: "asset-brand", label: "Brand color system", status: "Received", owner: "Marketing" }
  ],
  qaFindings: [
    { id: "qa-a11y", label: "Stock quote widget focus order skips disclosure link", severity: "High", resolved: false, wcag: "2.4.3" },
    { id: "qa-feed", label: "SEC filing feed delayed in mock adapter", severity: "Medium", resolved: false }
  ],
  launchAuthorized: false,
  deploymentPrepared: false,
  smokeTestPassed: false,
  debriefComplete: false,
  improvementProposed: false,
  audit: [
    {
      id: "audit-1",
      actor: "Avery Chen",
      action: "Project seeded",
      timestamp: "2026-06-25T12:00:00.000Z",
      detail: "Meridian Applied Robotics simulated client journey created."
    }
  ]
};

const baseState: AppState = {
  currentUserId: "user-pm",
  users: [
    { id: "user-exec", name: "Morgan Vale", role: "Executive" },
    { id: "user-pm", name: "Avery Chen", role: "Project Manager" },
    { id: "user-qa", name: "Priya Shah", role: "QA Lead" },
    { id: "user-viewer", name: "Read Only", role: "Viewer" }
  ],
  clients: [
    {
      id: "client-meridian",
      name: "Meridian Applied Robotics, Inc.",
      ticker: "NASDAQ: MARX",
      industry: "Industrial automation and autonomous inspection systems",
      health: "Watch",
      revenueSignal: "$184k ARR simulated",
      contacts: [
        { id: "c1", name: "Elaine Porter", title: "Chief Financial Officer", email: "elaine.porter@meridian.example", approvalAuthority: true },
        { id: "c2", name: "Jon Bell", title: "VP Investor Relations", email: "jon.bell@meridian.example", approvalAuthority: true },
        { id: "c3", name: "Mina Flores", title: "IT Director", email: "mina.flores@meridian.example", approvalAuthority: false }
      ],
      websites: [
        { id: "site-corp", domain: "meridianrobotics.example", type: "Corporate", status: "Build" },
        { id: "site-ir", domain: "investors.meridianrobotics.example", type: "Investor Relations", status: "QA" }
      ]
    }
  ],
  projects: [meridianProject],
  integrations: [
    { id: "cms", name: "CMS", state: "Healthy", adapter: "MockCMSAdapter" },
    { id: "sec", name: "SEC filing feed", state: "Delayed", adapter: "MockSecFeedAdapter" },
    { id: "stock", name: "Stock quote", state: "Failed", adapter: "MockStockDataAdapter" },
    { id: "dns", name: "DNS", state: "Recovery", adapter: "MockDnsAdapter" },
    { id: "deploy", name: "Hosting deployment", state: "Healthy", adapter: "MockDeploymentAdapter" },
    { id: "newswire", name: "Newswire", state: "Healthy", adapter: "MockNewswireAdapter" }
  ],
  aiRecords: [],
  knowledge: [
    { id: "kb-1", title: "IR launch authorization checklist", category: "Launch", verified: "2026-06-20", status: "Approved" },
    { id: "kb-2", title: "SEC feed delayed-state recovery", category: "Integrations", verified: "2026-06-12", status: "Human review required" }
  ],
  csReviews: [
    { id: "cs-7", clientId: "client-meridian", cadence: "Day 7", status: "Scheduled" },
    { id: "cs-30", clientId: "client-meridian", cadence: "Day 30", status: "Ready for review" },
    { id: "cs-q", clientId: "client-meridian", cadence: "Quarterly", status: "Expansion signal: managed disclosure workflow" }
  ]
};

baseState.aiRecords = [generateOperationsBrief(baseState)];

export function createSeedState(): AppState {
  return JSON.parse(JSON.stringify(baseState)) as AppState;
}
