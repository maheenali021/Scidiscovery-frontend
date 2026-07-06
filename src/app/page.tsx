"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const samplePrompts = [
    "Simulate the temperature dependence of gas diffusion coefficients from 250K to 400K.",
    "Model the decay velocity in enzymatic reactions with varying substrate concentrations.",
    "Model the damping coefficients of a simple pendulum inside air vs. oil resistance.",
    "Investigate the Arrhenius kinetics of activation energy sweep in chemical solutions."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://maheenalishah-scidiscovery-ai.hf.space/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize research session.");
      }

      const data = await res.json();
      router.push(`/session/${data.run_id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check if the FastAPI backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent glow-text">
          AI Scientific Discovery Lab
        </h2>
        <p className="text-lg text-gray-400 max-w-xl mx-auto font-medium">
          Transform any scientific question into a hypothesis, research plan, virtual experiment, Python simulation code, and report.
        </p>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative flex items-center bg-[#0d1321] rounded-2xl border border-gray-800/80 p-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your scientific question (e.g. Model temperature-dependent diffusion)..."
              disabled={loading}
              className="flex-1 bg-transparent px-6 py-4 text-gray-200 placeholder-gray-500 text-sm focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-6 py-3 rounded-xl font-semibold text-white glow-btn disabled:opacity-50 disabled:cursor-not-allowed text-sm shrink-0 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Orchestrating...</span>
                </>
              ) : (
                <>
                  <span>Begin Discovery</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}
      </form>

      {/* Sample Prompts Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Suggested Investigations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuestion(prompt)}
              className="p-5 text-left rounded-2xl bg-[#0b0f19]/40 border border-gray-800/60 hover:bg-[#111827]/60 hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/5 transition duration-200 flex flex-col justify-between h-32 group"
            >
              <p className="text-xs font-medium text-gray-300 group-hover:text-white leading-relaxed">
                {prompt}
              </p>
              <div className="flex items-center space-x-1 text-[10px] text-indigo-400 font-bold group-hover:text-indigo-300">
                <span>Select query</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
