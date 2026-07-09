import React from "react";

export default function Toast({ showToast }) {
  return (
    <div
      className={`fixed bottom-5 right-5 bg-emerald-950 text-emerald-300 px-4 py-3 rounded-xl border border-emerald-500/20 shadow-2xl flex items-center gap-2 transform transition-all duration-300 z-50 ${showToast ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}
    >
      <span className="text-base">✅</span>
      <div className="text-xs">
        <p className="font-semibold text-white">Record Successfully Saved</p>
        <p className="text-[10px] text-emerald-400">
          Pushed dynamically to MongoDB Database cluster
        </p>
      </div>
    </div>
  );
}
