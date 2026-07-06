import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Scientific Discovery Lab",
  description: "Autonomous multi-agent research platform for scientific inquiry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-gray-100">
        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar Navigation */}
          <aside className="w-64 bg-[#0b0f19]/80 border-r border-gray-800 flex flex-col justify-between p-6 shrink-0 glass">
            <div>
              {/* Brand Logo */}
              <div className="flex items-center space-x-3 mb-10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
                  S
                </div>
                <div>
                  <h1 className="font-extrabold text-lg bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    SciDiscovery
                  </h1>
                  <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
                    AI Scientific Lab
                  </p>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/40 transition duration-200"
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm font-medium">Home Dashboard</span>
                </Link>

                <Link
                  href="/history"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/40 transition duration-200"
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Run History</span>
                </Link>
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="pt-6 border-t border-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-violet-900/50 border border-violet-500/30 flex items-center justify-center text-xs font-semibold text-violet-300">
                  R
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-300">Researcher</p>
                  <p className="text-[10px] text-gray-500">Active Session</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Layout Area */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#030712]">
            {/* Header Status Bar */}
            <header className="h-16 border-b border-gray-800/50 bg-[#070b14]/50 flex items-center justify-between px-8 shrink-0 glass">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400">Agent Core Online</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                FastAPI: <span className="text-green-400">https://maheenalishah-scidiscovery-ai.hf.space</span>
              </div>
            </header>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-8 relative">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
