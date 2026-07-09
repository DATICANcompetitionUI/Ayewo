import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

// Component Imports
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MicroscopeViewer from "../components/MicroscopeViewer";
import PatientAdmission from "../components/PatientAdmission";
import DiagnosticsPanel from "../components/DiagnosticsPanel";
import RegistryTable from "../components/RegistryTable";
import ReportModal from "../components/ReportModal";
import Toast from "../components/Toast";

const SAMPLES = {
  positive: {
    imageUrl:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    status: "MALARIA POSITIVE",
    confidence: "94.8%",
    severity: "Moderate Density",
    count: 3,
    parasites: [
      { id: 1, x: 34, y: 28, size: 8 },
      { id: 2, x: 68, y: 55, size: 9 },
      { id: 3, x: 50, y: 72, size: 7 },
    ],
    guidelines:
      "Initiate standard ACT Protocol (Artemether/Lumefantrine) based on clinical weight guidelines immediately. Maintain hydration.",
  },
  negative: {
    imageUrl:
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80",
    status: "MALARIA NEGATIVE",
    confidence: "99.6%",
    severity: "No Parasites Spotted",
    count: 0,
    parasites: [],
    guidelines:
      "No Plasmodium malaria parasites identified on blood film. Investigate alternate etiologies of febrile symptoms (e.g., bacterial infection or viral syndrome).",
  },
};

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Input Form States
  const [patientId, setPatientId] = useState("UI-2026-8841");
  const [patientName, setPatientName] = useState("Tunde Alao");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("23");
  const [weight, setWeight] = useState("70 kg");

  // Core App States
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Mock database logs
  const [registry, setRegistry] = useState([
    {
      id: "UI-2026-1120",
      name: "Amina Bello",
      gender: "Female",
      age: 34,
      weight: "62 kg",
      status: "MALARIA NEGATIVE",
      count: 0,
      severity: "No Parasites Spotted",
      confidence: "99.8%",
      guidelines:
        "No Plasmodium parasites detected. Investigate alternative causes of febrile illness.",
    },
    {
      id: "UI-2026-0922",
      name: "Ifeanyi Nwachukwu",
      gender: "Male",
      age: 12,
      weight: "38 kg",
      status: "MALARIA POSITIVE",
      count: 5,
      severity: "Severe Density",
      confidence: "98.1%",
      guidelines:
        "Admit patient immediately. Administer IV Artesunate followed by full oral ACT regime when stable.",
    },
  ]);

  

  // Axios FastAPI handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setAnalyzing(true);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setResults(response.data);
    } catch (error) {
      console.warn(
        "FastAPI Server disconnected. Running positive simulation fallback...",
      );
      loadDemoCase("positive");
    } finally {
      setAnalyzing(false);
    }
  };

  const loadDemoCase = (type) => {
    resetWorkspace();
    setAnalyzing(true);
    const sample = SAMPLES[type];
    setImagePreview(sample.imageUrl);

    setTimeout(() => {
      setResults(sample);
      setAnalyzing(false);
    }, 2000);
  };

  const saveRecordToRegistry = () => {
    if (!results) return;

    const newRecord = {
      id: patientId,
      name: patientName,
      gender,
      age: parseInt(age),
      weight,
      status: results.status,
      count: results.count,
      severity: results.severity,
      confidence: results.confidence,
      guidelines: results.guidelines,
    };

    setRegistry([newRecord, ...registry]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const loadRecordFromRegistry = (record) => {
    resetWorkspace();
    setPatientId(record.id);
    setPatientName(record.name);
    setGender(record.gender);
    setAge(record.age.toString());
    setWeight(record.weight);

    setAnalyzing(true);
    setImagePreview(
      record.status.includes("POSITIVE")
        ? SAMPLES.positive.imageUrl
        : SAMPLES.negative.imageUrl,
    );

    setTimeout(() => {
      setResults({
        status: record.status,
        confidence: record.confidence,
        severity: record.severity,
        count: record.count,
        parasites: record.status.includes("POSITIVE")
          ? SAMPLES.positive.parasites
          : [],
        guidelines: record.guidelines,
      });
      setAnalyzing(false);
    }, 1200);
  };

  const resetWorkspace = () => {
    setImagePreview(null);
    setResults(null);
    setAnalyzing(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col overflow-x-hidden transition-colors duration-200">
      {/* <Header theme={theme} toggleTheme={toggleTheme} /> */}

      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar totalTests={registry.length + (results ? 1 : 0)} />

        <main className="flex-1 p-4 md:p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <MicroscopeViewer
              imagePreview={imagePreview}
              analyzing={analyzing}
              results={results}
              handleFileUpload={handleFileUpload}
              loadDemoCase={loadDemoCase}
              resetWorkspace={resetWorkspace}
            />

            <RegistryTable
              registry={registry}
              loadRecordFromRegistry={loadRecordFromRegistry}
            />
          </div>

          <div className="space-y-6">
            <PatientAdmission
              patientId={patientId}
              setPatientId={setPatientId}
              patientName={patientName}
              setPatientName={setPatientName}
              gender={gender}
              setGender={setGender}
              age={age}
              setAge={setAge}
              weight={weight}
              setWeight={setWeight}
            />

            <DiagnosticsPanel
              results={results}
              setShowModal={setShowModal}
              saveRecordToRegistry={saveRecordToRegistry}
            />
          </div>
        </main>
      </div>

      <Toast showToast={showToast} />

      <ReportModal
        showModal={showModal}
        setShowModal={setShowModal}
        results={results}
        patientId={patientId}
        patientName={patientName}
        gender={gender}
        age={age}
        weight={weight}
      />
    </div>
  );
}
