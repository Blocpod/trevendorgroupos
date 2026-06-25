import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  FileCheck2,
  Gauge,
  KeyRound,
  Lock,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { advanceProject, completeRequirement, evaluateGate, resolveFinding } from "./domain/lifecycle";
import { classifyRequest } from "./domain/requests";
import { AppState, Project } from "./domain/types";
import { loadState, resetState, saveState } from "./services/repository";
import "./styles.css";

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState("Command");
  const [message, setMessage] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [requestText, setRequestText] = useState("Broken stock quote integration on IR homepage");

  useEffect(() => saveState(state), [state]);

  const user = state.users.find((candidate) => candidate.id === state.currentUserId) ?? state.users[0];
  const project = state.projects[0];
  const client = state.clients.find((item) => item.id === project.clientId)!;
  const missing = evaluateGate(project);
  const aiBrief = state.aiRecords[0];

  const kpis = useMemo(
    () => [
      ["Clients", state.clients.length.toString(), "Portfolio records"],
      ["Active projects", state.projects.length.toString(), "Lifecycle controlled"],
      ["Open requests", project.requests.filter((request) => request.status !== "Resolved").length.toString(), "Classified work"],
      ["Gate blockers", missing.length.toString(), "Evidence required"]
    ],
    [state.clients.length, state.projects.length, project.requests, missing.length]
  );

  function updateProject(next: Project, note?: string) {
    setState((current) => ({ ...current, projects: current.projects.map((item) => (item.id === next.id ? next : item)) }));
    if (note) setMessage(note);
  }

  function advance() {
    const result = advanceProject(project, user.name, user.role, overrideReason || undefined);
    updateProject(result.project, result.message);
    if (result.ok) setOverrideReason("");
  }

  function addClassifiedRequest() {
    const classification = classifyRequest(requestText);
    const next: Project = {
      ...project,
      requests: [
        {
          id: crypto.randomUUID(),
          title: requestText.slice(0, 58),
          description: requestText,
          classification,
          severity: classification === "Emergency issue" ? "Emergency" : classification === "Defect" ? "High" : "Medium",
          complianceSensitive: /ir|investor|release|filing|quote/i.test(requestText),
          owner: classification === "Scope expansion" ? "Executive" : "Project Manager",
          due: "2026-07-12",
          status: classification === "Scope expansion" ? "Escalated" : "Open",
          approval: "AI-assisted",
          evidence: "MockAIProvider classification with deterministic keyword source."
        },
        ...project.requests
      ],
      audit: [
        {
          id: crypto.randomUUID(),
          actor: user.name,
          action: "Request classified",
          timestamp: new Date().toISOString(),
          detail: `${classification}: ${requestText}`
        },
        ...project.audit
      ]
    };
    updateProject(next, `Request classified as ${classification}.`);
  }

  return (
    <main className="app-shell">
      <aside className="rail" aria-label="Primary navigation">
        <div className="brand" aria-label="VendorGroupOS">
          <span>VendorGroup</span>
          <strong>OS</strong>
        </div>
        {["Command", "Clients", "Projects", "Requests", "Launch", "Knowledge", "Success", "Governance"].map((item) => (
          <button className={view === item ? "active" : ""} key={item} onClick={() => setView(item)}>
            {item}
          </button>
        ))}
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Private operating system</p>
            <h1>{view === "Command" ? "Command Center" : view}</h1>
          </div>
          <label className="role-select">
            <KeyRound size={16} />
            <span className="sr-only">Simulated role</span>
            <select value={user.id} onChange={(event) => setState({ ...state, currentUserId: event.target.value })}>
              {state.users.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.name} - {option.role}
                </option>
              ))}
            </select>
          </label>
        </header>

        {message && (
          <div className="notice" role="status">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        {view === "Command" && (
          <>
            <section className="hero-panel">
              <div>
                <p className="eyebrow">Current client journey</p>
                <h2>{client.name}</h2>
                <p>
                  {client.ticker} · {client.industry}
                </p>
              </div>
              <div className={`health ${project.health.toLowerCase()}`}>{project.health}</div>
            </section>
            <section className="kpi-grid">
              {kpis.map(([label, value, detail]) => (
                <article className="metric" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>{detail}</small>
                </article>
              ))}
            </section>
            <section className="split">
              <Panel icon={<Brain />} title="AI Operations Brief" action={aiBrief.status}>
                <p>{aiBrief.body}</p>
                <small>Sources: {aiBrief.sources.join(", ")} · Confidence {Math.round(aiBrief.confidence * 100)}%</small>
              </Panel>
              <Panel icon={<Activity />} title="Integration States" action="Mock adapters">
                <div className="integration-grid">
                  {state.integrations.map((integration) => (
                    <span className={`pill ${integration.state.toLowerCase()}`} key={integration.id}>
                      {integration.name}: {integration.state}
                    </span>
                  ))}
                </div>
              </Panel>
            </section>
          </>
        )}

        {view === "Clients" && (
          <Panel icon={<Gauge />} title={client.name} action={client.revenueSignal}>
            <div className="record-grid">
              {client.contacts.map((contact) => (
                <article className="record" key={contact.id}>
                  <strong>{contact.name}</strong>
                  <span>{contact.title}</span>
                  <small>{contact.email}</small>
                </article>
              ))}
              {client.websites.map((site) => (
                <article className="record" key={site.id}>
                  <strong>{site.domain}</strong>
                  <span>{site.type}</span>
                  <small>{site.status}</small>
                </article>
              ))}
            </div>
          </Panel>
        )}

        {view === "Projects" && (
          <section className="split">
            <Panel icon={<ShieldCheck />} title={project.name} action={project.stage}>
              <div className="timeline" aria-label="Project lifecycle">
                {["Sales", "Finance", "Onboarding", "Design", "Development", "Internal QA", "Client QA", "Launch Authorization", "Launch", "Post-Launch"].map((stage) => (
                  <span className={stage === project.stage ? "current" : ""} key={stage}>
                    {stage}
                  </span>
                ))}
              </div>
              <h3>Missing Requirements</h3>
              {missing.length ? missing.map((item) => <p className="blocker" key={item}>{item}</p>) : <p>No blockers for this stage.</p>}
              <div className="control-row">
                <input value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)} placeholder="Override reason, if needed" />
                <button onClick={advance}>
                  Advance <ArrowRight size={16} />
                </button>
              </div>
            </Panel>
            <Panel icon={<FileCheck2 />} title="Evidence Controls" action="Persistent audit">
              {project.requirements.filter((requirement) => requirement.stage === project.stage).map((requirement) => (
                <button
                  className="wide-action"
                  key={requirement.id}
                  disabled={requirement.complete}
                  onClick={() => updateProject(completeRequirement(project, requirement.id, user.name, `${requirement.label} completed in demo.`), "Requirement completed.")}
                >
                  {requirement.complete ? "Complete" : "Complete"} · {requirement.label}
                </button>
              ))}
              {project.qaFindings.map((finding) => (
                <button className="wide-action" disabled={finding.resolved} key={finding.id} onClick={() => updateProject(resolveFinding(project, finding.id, user.name), "QA finding resolved.")}>
                  {finding.resolved ? "Resolved" : "Resolve"} · {finding.label}
                </button>
              ))}
            </Panel>
          </section>
        )}

        {view === "Requests" && (
          <Panel icon={<Sparkles />} title="Work Requests" action="AI-assisted classification">
            <div className="control-row">
              <input value={requestText} onChange={(event) => setRequestText(event.target.value)} aria-label="Request description" />
              <button onClick={addClassifiedRequest}>
                <Plus size={16} /> Classify
              </button>
            </div>
            <div className="record-grid">
              {project.requests.map((request) => (
                <article className="record" key={request.id}>
                  <strong>{request.title}</strong>
                  <span>{request.classification} · {request.severity}</span>
                  <small>{request.status} · {request.approval}</small>
                </article>
              ))}
            </div>
          </Panel>
        )}

        {view === "Launch" && (
          <Panel icon={<Lock />} title="Launch Center" action={project.launchAuthorized ? "Authorized" : "Authorization required"}>
            <div className="record-grid">
              <Toggle label="Client launch authorization" value={project.launchAuthorized} onClick={() => updateProject({ ...project, launchAuthorized: !project.launchAuthorized }, "Launch authorization updated.")} />
              <Toggle label="Deployment preparation" value={project.deploymentPrepared} onClick={() => updateProject({ ...project, deploymentPrepared: !project.deploymentPrepared }, "Deployment preparation updated.")} />
              <Toggle label="Smoke test passed" value={project.smokeTestPassed} onClick={() => updateProject({ ...project, smokeTestPassed: !project.smokeTestPassed }, "Smoke test updated.")} />
              <Toggle label="Debrief complete" value={project.debriefComplete} onClick={() => updateProject({ ...project, debriefComplete: !project.debriefComplete, improvementProposed: true }, "Debrief converted to playbook proposal.")} />
            </div>
          </Panel>
        )}

        {["Knowledge", "Success", "Governance"].includes(view) && (
          <Panel icon={<AlertTriangle />} title={view} action="Controlled records">
            <div className="record-grid">
              {[...state.knowledge.map((item) => `${item.title} · ${item.status}`), ...state.csReviews.map((item) => `${item.cadence} · ${item.status}`), "Roles and permissions matrix active", "Automation register uses mock adapters", "Production actions require human approval"].map((item) => (
                <article className="record" key={item}>
                  <strong>{item}</strong>
                  <span>Audit-aware simulated governance</span>
                </article>
              ))}
            </div>
          </Panel>
        )}

        <Panel icon={<RefreshCw />} title="Audit History" action="Immutable event stream">
          <div className="audit-list">
            {project.audit.slice(0, 8).map((event) => (
              <p key={event.id}>
                <strong>{event.action}</strong> by {event.actor}: {event.detail}
              </p>
            ))}
          </div>
          <button className="ghost" onClick={() => setState(resetState())}>Reset seeded demo</button>
        </Panel>
      </section>
    </main>
  );
}

function Panel({ icon, title, action, children }: { icon: React.ReactNode; title: string; action: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <header>
        <span className="panel-icon">{icon}</span>
        <h2>{title}</h2>
        <em>{action}</em>
      </header>
      {children}
    </section>
  );
}

function Toggle({ label, value, onClick }: { label: string; value: boolean; onClick: () => void }) {
  return (
    <button className="record toggle" onClick={onClick}>
      <strong>{label}</strong>
      <span>{value ? "Complete" : "Missing"}</span>
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
