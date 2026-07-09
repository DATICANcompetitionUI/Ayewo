import React from "react";

export default function Sidebar({ totalTests }) {
  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 space-y-6 flex flex-col justify-between transition-colors duration-200">
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Workspace Nav
          </p>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg border border-cyan-100 dark:border-cyan-500/20"
            >
              <span>📊</span> Diagnostics Lab
            </a>
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Today's Local Stats
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                TOTAL TESTS
              </p>
              <p className="text-xl font-bold text-slate-950 dark:text-white mt-1">
                {totalTests}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                POSITIVITY RATE
              </p>
              <p className="text-xl font-bold text-red-500 dark:text-red-400 mt-1">
                37.5%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 space-y-1">
        <p>Deployment Status: Local Host</p>
        <p>Model Hash: RESNET50-MAL-V2</p>
        <p>© July 2026 Àyẹ̀wò Group</p>
      </div>
    </aside>
  );
}
