import React from "react";

export default function DiagnosticsPanel({
  results,
  setShowModal,
  saveRecordToRegistry,
}) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between min-h-90 transition-colors duration-200">
      <div>
        <h3 className="font-bold text-slate-850 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
          Diagnostics Decision Support
        </h3>

        {!results ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
            <span class="text-3xl block mb-2">⏱️</span>
            Upload or choose a slide sample to trigger AI clinical analytics.
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl text-center space-y-1 border ${results.status.includes("POSITIVE") ? "bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400" : "bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`}
            >
              <p class="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400">
                AI Status Output
              </p>
              <h4 class="text-2xl font-black">{results.status}</h4>
              <p class="text-[10px] font-semibold">
                Confidence Match: {results.confidence}
              </p>
            </div>

            <div className="space-y-2.5 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-900">
                <span>Detected Pathogens:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {results.count} Cell(s) spotted
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-900">
                <span>Clinical Density:</span>
                <span
                  className={`font-bold ${results.status.includes("POSITIVE") ? "text-amber-600 dark:text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}
                >
                  {results.severity}
                </span>
              </div>
              <div className="flex flex-col gap-1 py-1.5">
                <span>Local Treatment Protocol:</span>
                <p className="text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg leading-relaxed border border-slate-200 dark:border-slate-800">
                  {results.guidelines}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-900">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>📄</span> Export Medical PDF Report
          </button>
          <button
            onClick={saveRecordToRegistry}
            className="w-full py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold rounded-xl text-[10px] transition-all"
          >
            💾 Save Record to MongoDB
          </button>
        </div>
      )}
    </div>
  );
}
