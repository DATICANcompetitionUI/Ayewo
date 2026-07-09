import React from "react";

export default function PatientAdmission({
  patientId,
  setPatientId,
  patientName,
  setPatientName,
  gender,
  setGender,
  age,
  setAge,
  weight,
  setWeight,
}) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4 transition-colors duration-200">
      <h3 className="font-bold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
        Active Patient Admission
      </h3>
      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 dark:text-slate-300">
        <div>
          <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">
            RECORD ID
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 font-mono text-slate-700 dark:text-white px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">
            GENDER
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-white px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:outline-none"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">
            PATIENT FULL NAME
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">
            AGE
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-white px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">
            WEIGHT
          </label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-white px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
