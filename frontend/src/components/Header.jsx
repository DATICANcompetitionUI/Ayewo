import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Header({ theme, toggleTheme }) {
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/single-screening", label: "Single Screening" },
    { to: "/batch-screening", label: "Batch Screening" },
  ];

  return (
    <header className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <span className="text-3xl bg-cyan-50 dark:bg-cyan-950 p-2 rounded-xl border border-cyan-200 dark:border-cyan-500/20">
          🔬
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ÀYẸ̀WÒ
            </h1>
            {/* <span class="text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">
              V1.0-PRODUCTION
            </span> */}
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Malaria Blood Smear Screening • For trained lab technicians and
            doctors only.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <nav className="flex flex-wrap gap-2" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md border px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        {/* <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-sm"
          title="Toggle Theme"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button> */}
        <div class="text-right hidden sm:block text-xs">
          <p class="font-semibold text-slate-600 dark:text-slate-300">
            Active Lab node: UI-Hospital-01
          </p>
          {/* <p class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 justify-end">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>{" "}
            FastAPI Engine Online
          </p> */}
        </div>
      </div>
    </header>
  );
}
