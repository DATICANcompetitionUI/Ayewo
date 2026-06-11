import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/client'

function DashboardPage() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const { data } = await api.get('/health')
        setHealth(data)
      } catch {
        setError('Unable to reach the backend API. Confirm network and API URL settings.')
      }
    }

    fetchHealth()
  }, [])

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">System status</h2>
        {error ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm text-slate-600">API availability</p>
              <p className="font-semibold text-slate-900">{health?.status === 'ok' ? 'Online' : 'Checking...'}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm text-slate-600">Model status</p>
              <p className="font-semibold text-slate-900">{health?.model_loaded ? 'Loaded' : 'Not loaded'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/single-screening"
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-emerald-300"
        >
          <h3 className="text-lg font-semibold">Single Screening</h3>
          <p className="mt-2 text-sm text-slate-600">
            Upload one smear image for quick triage and Grad-CAM review.
          </p>
        </Link>
        <Link
          to="/batch-screening"
          className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-emerald-300"
        >
          <h3 className="text-lg font-semibold">Batch Screening</h3>
          <p className="mt-2 text-sm text-slate-600">
            Process multiple images, review a table of results, and download the batch PDF report.
          </p>
        </Link>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Clinical note: Ayewo is a decision-support aid and must be used alongside standard clinical and laboratory protocols.
      </div>
    </section>
  )
}

export default DashboardPage
