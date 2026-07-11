import React from "react";

export default function MicroscopeViewer({
  imagePreview,
  analyzing,
  results,
  handleFileUpload,
  loadDemoCase,
  resetWorkspace,
}) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
      <div className="border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50 dark:bg-slate-950/60">
        <div>
          <h2 className="font-bold text-slate-850 dark:text-white text-base">
            Àyẹ̀wò Clinical Digital Microscope
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Analyze microscope blood smear images to find Plasmodium parasites
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">
            Load Demo:
          </span>
          <button
            onClick={() => loadDemoCase("positive")}
            className="px-2.5 py-1 text-xs font-semibold bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded transition-all"
          >
            Positive Case
          </button>
          <button
            onClick={() => loadDemoCase("negative")}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded transition-all"
          >
            Negative Case
          </button>
        </div>
      </div>

      <div className="p-6 flex justify-center bg-slate-50 dark:bg-slate-950 relative min-h-95 items-center transition-colors duration-200">
        {!imagePreview ? (
          <div className="max-w-md w-full border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-cyan-500/50 bg-white dark:bg-slate-900/40 rounded-xl p-10 text-center transition-all">
            <input
              type="file"
              id="file-uploader"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-uploader" className="cursor-pointer block">
              <span className="text-5xl block mb-3">🔬</span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Select or Drag Blood Smear Slide
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Compatible with phone eyepiece attachments (JPG, PNG)
              </p>
              <span className="mt-4 inline-block px-3 py-1.5 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-xs text-white rounded font-medium transition-all">
                Browse File
              </span>
            </label>
          </div>
        ) : (
          <div className="relative max-w-xl w-full rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <img
              src={imagePreview}
              alt="Blood smear"
              className="w-full h-auto block opacity-85 saturate-150"
            />
            {analyzing && (
              <div className="absolute left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-400 to-transparent scanner-line shadow-[0_0_8px_#22d3ee] pointer-events-none"></div>
            )}
            {results &&
              results.parasites &&
              results.parasites.map((p) => (
                <div
                  key={p.id}
                  className="absolute border-2 border-red-500 rounded-full bg-red-500/20 animate-pulse flex items-center justify-center pointer-events-none shadow-[0_0_10px_#ef4444]"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.size}%`,
                    height: `${p.size}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="absolute -top-5 bg-red-600 text-[8px] font-black text-white px-1 rounded shadow">
                    P.falciparum
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <span>
          Status:{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {analyzing
              ? "AI Scanning blood slide..."
              : "Awaiting analysis output"}
          </span>
        </span>
        <button
          onClick={resetWorkspace}
          className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-lg transition-all font-medium"
        >
          Clear Slide
        </button>
      </div>
    </div>
  );
}
