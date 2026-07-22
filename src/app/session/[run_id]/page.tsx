"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface TimelineEvent {
  agent: string;
  task: string;
  output: string;
  timestamp: string;
}

interface RunResults {
  security_report: any;
  hypothesis: string | null;
  background: string | null;
  experiment_plan: string | null;
  code: string | null;
  simulation_output: string | null;
  charts: string[];
  final_report: string | null;
}

interface RunDetails {
  run_id: string;
  question: string;
  started_at: string;
  status: string;
  timeline: TimelineEvent[];
  results: RunResults;
  completed_at?: string;
}

export default function ResearchSessionPage() {
  const params = useParams();
  const runId = params.run_id as string;

  const [run, setRun] = useState<RunDetails | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"report" | "code" | "charts">("report");

  useEffect(() => {
    if (!runId) return;

    let isSubscribed = true;
    let intervalId: NodeJS.Timeout;

    const fetchRunDetails = async () => {
      try {
        const res = await fetch(`https://maheenalishah-scidiscovery-ai.hf.space/runs/${runId}`);
        if (!res.ok) {
          throw new Error("Failed to load run details.");
        }
        const data = await res.json();
        
        if (isSubscribed) {
          setRun(data);
          // Stop polling if completed or failed
          if (["completed", "failed", "error"].includes(data.status.toLowerCase())) {
            clearInterval(intervalId);
          }
        }
      } catch (err: any) {
        if (isSubscribed) {
          setError(err.message || "Error fetching run data.");
        }
      }
    };

    // Initial fetch
    fetchRunDetails();

    // Poll every 2 seconds for updates
    intervalId = setInterval(fetchRunDetails, 2000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [runId]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-red-950/30 border border-red-500/20 text-center">
        <p className="text-sm font-semibold text-red-400 mb-4">{error}</p>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 transition"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-semibold text-gray-400">Connecting to research session...</span>
      </div>
    );
  }

  // Helper to determine workflow graph node statuses
  const getNodeStatus = (node: string) => {
    const results = run.results;
    
    if (run.status === "failed") {
      if (node === "security" && results.security_report?.status === "FAILED") return "failed";
    }

    switch (node) {
      case "security":
        return results.security_report ? "completed" : "running";
      case "planner":
        if (results.hypothesis) return "completed";
        return results.security_report && !results.security_report.reason ? "running" : "pending";
      case "knowledge":
        if (results.background) return "completed";
        return results.hypothesis ? "running" : "pending";
      case "experiment":
        if (results.experiment_plan) return "completed";
        return results.background ? "running" : "pending";
      case "code":
        if (results.code) return "completed";
        return results.experiment_plan ? "running" : "pending";
      case "report":
        if (results.final_report) return "completed";
        return results.code ? "running" : "pending";
      default:
        return "pending";
    }
  };

  const nodeColorClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/40";
      case "running":
        return "bg-indigo-500/15 text-indigo-300 border-indigo-500/50 animate-pulse";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/40";
      default:
        return "bg-gray-900/40 text-gray-500 border-gray-800/80";
    }
  };

  return (
    <div className="space-y-8">
      {/* Session Title & Live Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800/50 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-100 max-w-2xl line-clamp-1">
              {run.question}
            </h2>
            {run.status.toLowerCase() === "running" && (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
                Live Processing
              </span>
            )}
            {run.status.toLowerCase() === "completed" && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                Completed
              </span>
            )}
            {(run.status.toLowerCase() === "failed" || run.status.toLowerCase() === "error") && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                Aborted / Error
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Session ID: {run.run_id}</p>
        </div>

        <Link
          href="/history"
          className="inline-flex items-center space-x-1.5 px-4 py-2 border border-gray-800 hover:bg-gray-800/40 rounded-xl text-xs font-bold text-gray-300 transition duration-200 self-start"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to History</span>
        </Link>
      </div>

      {/* Workflow Graph (FR-6, Phase 5) */}
      <section className="p-6 rounded-2xl bg-[#0b0f19]/30 border border-gray-800/60 glass-card">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
          Workflow Pipeline Graph
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: "security", label: "1. Security check" },
            { id: "planner", label: "2. Hypothesis" },
            { id: "knowledge", label: "3. Background" },
            { id: "experiment", label: "4. Exp. Design" },
            { id: "code", label: "5. Simulation" },
            { id: "report", label: "6. Final Report" }
          ].map((node) => {
            const status = getNodeStatus(node.id);
            return (
              <div
                key={node.id}
                className={`py-3 px-4 rounded-xl border text-center font-semibold text-xs flex flex-col justify-center items-center ${nodeColorClass(status)}`}
              >
                <span>{node.label}</span>
                <span className="text-[9px] opacity-70 uppercase tracking-widest mt-1">
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Left Timeline, Right Output Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Timeline (Explainability FR-2) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0b0f19]/30 border border-gray-800/60 glass-card flex flex-col h-[550px] overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 shrink-0">
              Agent Execution Timeline
            </h3>

            {/* List scrollbox */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-2">
              {run.timeline.length === 0 ? (
                <div className="text-center text-gray-500 text-xs py-10">
                  Awaiting security clearance...
                </div>
              ) : (
                run.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-indigo-500/20 last:border-0 pb-1">
                    {/* Glow dot */}
                    <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-background timeline-glow" />
                    
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-indigo-400">{event.agent}</h4>
                      <span className="text-[9px] text-gray-500 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-gray-200 mb-1 leading-snug">
                      {event.task}
                    </p>
                    {event.output && (
                      <p className="text-[10px] text-gray-400 bg-gray-900/30 p-2.5 rounded-lg font-mono line-clamp-3 leading-relaxed border border-gray-800/30">
                        {event.output}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Output Panel (FR-5, FR-6, FR-7) */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-[#0b0f19]/30 border border-gray-800/60 glass-card flex flex-col h-[550px] overflow-hidden">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-gray-800 bg-[#070b14]/50 shrink-0">
              {[
                { id: "report", label: "Scientific Report" },
                { id: "code", label: "Simulation Code" },
                { id: "charts", label: "Plots & Outputs" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-xs font-semibold border-b-2 transition duration-200 ${activeTab === tab.id ? "border-indigo-500 text-indigo-400 bg-indigo-500/[0.02]" : "border-transparent text-gray-400 hover:text-gray-200"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 font-medium leading-relaxed">
              
              {/* Report Tab */}
              {activeTab === "report" && (
                <div className="space-y-4">
                  {run.results.final_report ? (
                    <div className="prose prose-invert max-w-none text-xs text-gray-300">
                      <div className="whitespace-pre-wrap font-sans">
                        {run.results.final_report}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-500 text-xs">
                      {run.status === "failed"
                        ? "Research run was aborted. No report generated."
                        : "Generating report... Please wait."}
                    </div>
                  )}
                </div>
              )}

              {/* Code Tab */}
              {activeTab === "code" && (
                <div className="space-y-4">
                  {run.results.code ? (
                    <pre className="p-4 rounded-xl bg-gray-950/70 text-green-400 font-mono text-[11px] overflow-x-auto border border-gray-800 leading-normal">
                      <code>{run.results.code}</code>
                    </pre>
                  ) : (
                    <div className="text-center py-20 text-gray-500 text-xs">
                      {run.status === "failed"
                        ? "No simulation code generated."
                        : "Writing simulation code... Please wait."}
                    </div>
                  )}
                </div>
              )}

              {/* Charts & Output Tab */}
              {activeTab === "charts" && (
                <div className="space-y-6">
                  {/* Console Logs */}
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Simulation Execution Output
                    </h4>
                    {run.results.simulation_output ? (
                      <pre className="p-3 rounded-lg bg-gray-950 text-gray-300 font-mono text-[10px] overflow-x-auto border border-gray-900">
                        {run.results.simulation_output}
                      </pre>
                    ) : (
                      <div className="text-gray-500 text-xs py-4 italic">
                        {run.status === "failed"
                          ? "Simulation execution skipped."
                          : "Awaiting execution output logs..."}
                      </div>
                    )}
                  </div>

                  {/* Visual Charts */}
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Generated Plot Visualizations
                    </h4>
                    {run.results.charts && run.results.charts.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {run.results.charts.map((url, index) => (
                          <div key={index} className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950/40 p-4 flex flex-col items-center">
                            <img
                              src={`https://maheenalishah-scidiscovery-ai.hf.space${url}`}
                              alt={`Simulation Chart ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                            <p className="text-[9px] text-gray-500 text-center font-mono mt-1">{url.split("/").pop()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-xs py-10 text-center italic border border-dashed border-gray-800 rounded-xl">
                        {run.status === "failed"
                          ? "No plots generated."
                          : "Awaiting chart generation..."}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
