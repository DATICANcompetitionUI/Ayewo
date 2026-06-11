import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App'
import DashboardPage from './pages/DashboardPage'
import SingleScreeningPage from './pages/SingleScreeningPage'
import BatchScreeningPage from './pages/BatchScreeningPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DashboardPage />} />
          <Route path="single-screening" element={<SingleScreeningPage />} />
          <Route path="batch-screening" element={<BatchScreeningPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
