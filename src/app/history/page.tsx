"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Run {
  run_id: string;
  question: string;
  started_at: string;
  status: string;
  timeline: any[];
}

export default function RunHistoryPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRuns = async () => {
    try {
      const res = await fetch("https://maheenalishah-scidiscovery-ai.hf.space/runs");
      if (!res.ok) {
        throw new Error("Failed to fetch runs history.");
      }
      const data = await res.json();
      setRuns(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const getStatusBadge = (status: string) => {
    const base = "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ";
    switch (status.toLowerCase()) {
      case "completed":
        return <span className={`${base} bg-green-500/10 text-green-400 border-green-500/20`}>Completed</span>;
      case "running":
        return <span className={`${base} bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse`}>Running</span>;
      case "failed":
      case "error":
        return <span className={`${base} bg-red-500/10 text-red-400 border-red-500/20`}>Failed</span>;
      default:
        return <span className={`${base} bg-gray-500/10 text-gray-400 border-gray-500/20`}>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-semibold text-gray-400">Loading research history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-red-950/30 border border-red-500/20 text-center">
        <p className="text-sm font-semibold text-red-400 mb-4">{error}</p>
        <button
          onClick={() => { setLoading(true); setError(""); fetchRuns(); }}
          className="px-4 py-2 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Research Run History</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Browse through past hypothesis formulations and simulation run results.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchRuns(); }}
          className="p-2.5 rounded-xl border border-gray-800 hover:bg-gray-800/40 text-gray-300 transition duration-200"
          title="Refresh History"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
          </svg>
        </button>
      </div>

      {runs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-[#0b0f19]/30 border border-gray-800/50 p-8">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="font-semibold text-gray-300">No Research Runs Found</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1 leading-relaxed">
            Submit a scientific question on the Home Dashboard to launch your first multi-agent simulation.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-white glow-btn text-xs"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-800/80 bg-[#0b0f19]/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#070b14]/50">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">Scientific Query</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">Started At</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {runs.map((run) => (
                  <tr key={run.run_id} className="hover:bg-gray-800/10 transition">
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-gray-200 line-clamp-1 max-w-md">
                        {run.question}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: {run.run_id}</p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(run.status)}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                      {new Date(run.started_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/session/${run.run_id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-xs font-bold text-gray-300 hover:text-indigo-400 transition"
                      >
                        <span>Open Session</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
