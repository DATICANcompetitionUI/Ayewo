import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import api from '../api/client'

function BatchScreeningPage() {
  const [files, setFiles] = useState([])
  const [batchResult, setBatchResult] = useState(null)
  const [batchIdInput, setBatchIdInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [error, setError] = useState('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    maxFiles: 50,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
      setBatchResult(null)
      setError('')
    },
  })

  const runBatchScreening = async () => {
    if (!files.length) {
      setError('Add one or more images before batch screening.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))
      const { data } = await api.post('/predict/batch', formData)
      setBatchResult(data)
      setBatchIdInput(data.batch_id)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Batch screening failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (batchId) => {
    if (!batchId) {
      setError('Provide a batch ID to download a report.')
      return
    }

    setDownloadLoading(true)
    setError('')

    try {
      const response = await api.get(`/report/${batchId}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `batch_report_${batchId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not download the report for this batch ID.')
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Batch Screening</h2>
        <p className="mt-2 text-sm text-slate-600">Upload up to 50 smear images to generate a consolidated screening report.</p>

        <div
          {...getRootProps()}
          className={`mt-4 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
            isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-slate-700">{files.length ? `${files.length} image(s) selected` : 'Drag and drop images here, or click to choose files.'}</p>
        </div>

        <button
          type="button"
          onClick={runBatchScreening}
          disabled={loading}
          className="mt-4 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Processing batch...' : 'Run Batch Screening'}
        </button>

        {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold">Batch Report Download</h3>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <input
            value={batchIdInput}
            onChange={(event) => setBatchIdInput(event.target.value)}
            placeholder="Enter batch ID"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => downloadReport(batchIdInput.trim())}
            disabled={downloadLoading}
            className="rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
          >
            {downloadLoading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {batchResult?.results?.length ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold">Batch Results</h3>
          <p className="mt-1 text-sm text-slate-600">Batch ID: {batchResult.batch_id}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2">Filename</th>
                  <th className="border-b border-slate-200 px-3 py-2">Result</th>
                  <th className="border-b border-slate-200 px-3 py-2">Confidence</th>
                  <th className="border-b border-slate-200 px-3 py-2">Flag</th>
                </tr>
              </thead>
              <tbody>
                {batchResult.results.map((row, index) => (
                  <tr key={`${row.filename}-${index}`}>
                    <td className="border-b border-slate-200 px-3 py-2">{row.filename}</td>
                    <td className="border-b border-slate-200 px-3 py-2">{row.result}</td>
                    <td className="border-b border-slate-200 px-3 py-2">{row.confidence}%</td>
                    <td className="border-b border-slate-200 px-3 py-2">
                      {row.low_confidence ? (
                        <span className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">Low confidence</span>
                      ) : (
                        <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">Clear</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default BatchScreeningPage
