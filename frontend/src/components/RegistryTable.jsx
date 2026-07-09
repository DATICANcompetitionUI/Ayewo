import React from "react";

export default function RegistryTable({ registry, loadRecordFromRegistry }) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">
          Active Lab Registry
        </h3>
        <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
          MongoDB Synchronized
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs text-slate-500 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase text-[9px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Record ID</th>
              <th className="px-5 py-3.5">Patient Details</th>
              <th className="px-5 py-3.5">AI Result Label</th>
              <th className="px-5 py-3.5 text-right">Interactive Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {registry.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <td className="px-5 py-3 font-mono text-cyan-600 dark:text-cyan-400">
                  {record.id}
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-800 dark:text-white">
                    {record.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {record.age} Yrs • {record.gender}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${record.status.includes("POSITIVE") ? "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"}`}
                  >
                    {record.status} ({record.confidence})
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => loadRecordFromRegistry(record)}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold text-xs tracking-wide"
                  >
                    Load Data
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
