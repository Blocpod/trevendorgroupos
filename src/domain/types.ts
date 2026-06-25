export type Role = "Executive" | "Project Manager" | "Designer" | "Developer" | "QA Lead" | "Client Success" | "Viewer";

export type Stage =
  | "Sales"
  | "Finance"
  | "Onboarding"
  | "Design"
  | "Development"
  | "Internal QA"
  | "Client QA"
  | "Launch Authorization"
  | "Launch"
  | "Post-Launch"
  | "Customer Success"
  | "Account Management";

export type RequestClass =
  | "Defect"
  | "Correction"
  | "Included revision"
  | "Content update"
  | "New feature"
  | "Scope expansion"
  | "Future phase"
  | "Support request"
  | "Emergency issue";

export type Health = "Healthy" | "Watch" | "Blocked" | "Critical";
export type IntegrationState = "Healthy" | "Delayed" | "Failed" | "Recovery";
export type ApprovalState = "Draft" | "AI-assisted" | "Human review required" | "Approved" | "Rejected";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  approvalAuthority: boolean;
}

export interface Website {
  id: string;
  domain: string;
  type: "Corporate" | "Investor Relations" | "Microsite";
  status: "Planning" | "Build" | "QA" | "Live";
}

export interface Client {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  health: Health;
  revenueSignal: string;
  contacts: Contact[];
  websites: Website[];
}

export interface GateRequirement {
  id: string;
  label: string;
  stage: Stage;
  complete: boolean;
  evidence?: string;
}

export interface Task {
  id: string;
  label: string;
  owner: Role;
  due: string;
  done: boolean;
}

export interface WorkRequest {
  id: string;
  title: string;
  description: string;
  classification: RequestClass;
  severity: "Low" | "Medium" | "High" | "Emergency";
  complianceSensitive: boolean;
  owner: Role;
  due: string;
  status: "Open" | "In review" | "Approved" | "Resolved" | "Escalated";
  approval: ApprovalState;
  evidence?: string;
}

export interface Asset {
  id: string;
  label: string;
  status: "Received" | "Missing" | "Needs replacement";
  owner: string;
}

export interface QaFinding {
  id: string;
  label: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  resolved: boolean;
  wcag?: string;
}

export interface Integration {
  id: string;
  name: string;
  state: IntegrationState;
  adapter: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  detail: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  stage: Stage;
  health: Health;
  owner: Role;
  requirements: GateRequirement[];
  tasks: Task[];
  requests: WorkRequest[];
  assets: Asset[];
  qaFindings: QaFinding[];
  launchAuthorized: boolean;
  deploymentPrepared: boolean;
  smokeTestPassed: boolean;
  debriefComplete: boolean;
  improvementProposed: boolean;
  audit: AuditEvent[];
}

export interface AiRecord {
  id: string;
  title: string;
  status: ApprovalState;
  confidence: number;
  sources: string[];
  body: string;
}

export interface AppState {
  users: User[];
  currentUserId: string;
  clients: Client[];
  projects: Project[];
  integrations: Integration[];
  aiRecords: AiRecord[];
  knowledge: { id: string; title: string; category: string; verified: string; status: ApprovalState }[];
  csReviews: { id: string; clientId: string; cadence: "Day 7" | "Day 30" | "Day 90" | "Quarterly"; status: string }[];
}

export const stages: Stage[] = [
  "Sales",
  "Finance",
  "Onboarding",
  "Design",
  "Development",
  "Internal QA",
  "Client QA",
  "Launch Authorization",
  "Launch",
  "Post-Launch",
  "Customer Success",
  "Account Management"
];
