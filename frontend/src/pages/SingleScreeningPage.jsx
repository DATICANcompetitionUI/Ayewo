import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import api from '../api/client'

function SingleScreeningPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const [file] = acceptedFiles
      setSelectedFile(file || null)
      setResult(null)
      setError('')
    },
  })

  const submitForScreening = async () => {
    if (!selectedFile) {
      setError('Select an image file before screening.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const { data } = await api.post('/predict/single', formData)
      setResult(data)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Screening failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Single Screening</h2>
        <p className="mt-2 text-sm text-slate-600">Upload one smear image to receive classification, confidence, and Grad-CAM output.</p>

        <div
          {...getRootProps()}
          className={`mt-4 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
            isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-slate-700">
            {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag and drop an image here, or click to choose a file.'}
          </p>
        </div>

        <button
          type="button"
          onClick={submitForScreening}
          disabled={loading}
          className="mt-4 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Screening...' : 'Run Screening'}
        </button>

        {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </div>

      {result ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold">Result</h3>
            <p className="mt-3 text-sm text-slate-600">Classification</p>
            <p className="text-xl font-bold text-slate-900">{result.result}</p>
            <p className="mt-3 text-sm text-slate-600">Confidence</p>
            <p className="text-xl font-bold text-slate-900">{result.confidence}%</p>
            {result.low_confidence ? (
              <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-2 text-sm text-amber-900">
                Low-confidence flag: confirm with additional lab review.
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold">Grad-CAM</h3>
            <img
              src={`data:image/png;base64,${result.gradcam_image}`}
              alt="Grad-CAM visualization"
              className="mt-3 w-full rounded-md border border-slate-200"
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default SingleScreeningPage
