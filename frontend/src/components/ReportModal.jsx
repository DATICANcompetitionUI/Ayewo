import React from "react";

export default function ReportModal({
  showModal,
  setShowModal,
  results,
  patientId,
  patientName,
  gender,
  age,
  weight,
}) {
  if (!showModal || !results) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 z-50">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl p-8 shadow-2xl my-8 relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-semibold text-lg p-2"
        >
          ✕
        </button>

        <div id="printable-area" className="space-y-6">
          <div className="flex justify-between items-start border-b-2 border-slate-950 pb-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                ÀYẸ̀WÒ DIAGNOSTICS
              </h2>
              <p className="text-xs text-slate-500">
                University of Ibadan Teaching Hospital • Lab Node 01
              </p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-950">
                REPORT ID: <span>{patientId}</span>
              </p>
              <p>Generated: 11 June, 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span class="block text-[10px] text-slate-400 font-bold uppercase">
                PATIENT FULL NAME
              </span>
              <span class="font-bold text-slate-950 text-sm">
                {patientName}
              </span>
            </div>
            <div>
              <span class="block text-[10px] text-slate-400 font-bold uppercase">
                AGE / GENDER
              </span>
              <span class="font-bold text-slate-950">
                {age} Years / {gender}
              </span>
            </div>
            <div>
              <span class="block text-[10px] text-slate-400 font-bold uppercase">
                WEIGHT
              </span>
              <span class="font-bold text-slate-950">{weight}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-1">
              AI Automated Microscopy Analytics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl text-center border ${results.status.includes("POSITIVE") ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
              >
                <span className="block text-[9px] uppercase font-extrabold tracking-wider">
                  AI Classification
                </span>
                <span className="text-lg font-black block mt-1">
                  {results.status}
                </span>
              </div>
              <div className="flex flex-col justify-center space-y-1.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Confidence Match:</span>
                  <span className="font-bold">{results.confidence}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Microscopic Count:</span>
                  <span className="font-bold">
                    {results.count} cell(s) spotted
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-1">
              Recommended Treatment Protocol
            </h4>
            <p className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed text-slate-700">
              {results.guidelines}
            </p>
          </div>

          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold text-slate-400">
                Àyẹ̀wò Inference Core Engine
              </p>
              <p className="text-slate-600">Model Hash: RESNET50-MAL-V2</p>
            </div>
            <div className="text-right flex flex-col justify-end items-end">
              <div className="w-32 border-b border-slate-900 h-8"></div>
              <p class="mt-1 font-semibold text-slate-800">
                Reviewing Physician Signature
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-2 text-xs">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-lg transition-all font-semibold shadow-md"
          >
            Print PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
