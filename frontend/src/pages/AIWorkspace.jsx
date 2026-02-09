import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { runPipeline, generateAssumptions, generateFailureModes } from "../Services/api"

const pageStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }

  .page-bg {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    min-height: 100vh;
  }

  .glass-dark {
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .result-card {
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
  }

  .result-card:hover {
    border-color: rgba(99, 102, 241, 0.5);
  }

  .loading-dot {
    animation: pulse 1.5s ease-in-out infinite;
  }

  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  .gradient-text {
    background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const Icons = {
  back: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  hypothesis: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  assumption: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  failure: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  refresh: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  save: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
}

export default function AIWorkspace() {
  const navigate = useNavigate()
  const { ingestId } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState({
    hypothesis: null,
    assumptions: [],
    failureModes: []
  })

  useEffect(() => {
    const storedProject = localStorage.getItem("currentProject")
    if (storedProject) {
      setProject(JSON.parse(storedProject))
    }

    // Run pipeline automatically
    runAnalysis()
  }, [ingestId])

  const runAnalysis = async () => {
    setProcessing(true)
    setError("")

    try {
      const result = await runPipeline(parseInt(ingestId))

      if (result.error) {
        setError(result.error)
        return
      }

      setResults({
        hypothesis: result.hypothesis,
        assumptions: result.assumptions || [],
        failureModes: result.failure_modes || []
      })
    } catch (err) {
      console.error("Pipeline error:", err)
      setError("Failed to run analysis. Please try again.")
    } finally {
      setLoading(false)
      setProcessing(false)
    }
  }

  const regenerateAssumptions = async () => {
    if (!results.hypothesis) return
    setProcessing(true)
    
    try {
      const result = await generateAssumptions(results.hypothesis.id)
      if (!result.error) {
        setResults(prev => ({ ...prev, assumptions: result.assumptions || [] }))
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setProcessing(false)
    }
  }

  const regenerateFailures = async () => {
    if (!results.hypothesis) return
    setProcessing(true)
    
    try {
      const result = await generateFailureModes(results.hypothesis.id)
      if (!result.error) {
        setResults(prev => ({ ...prev, failureModes: result.failure_modes || [] }))
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <style>{pageStyles}</style>
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 rounded-full bg-indigo-500 loading-dot" />
            ))}
          </div>
          <p className="text-gray-400">Analyzing your research...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg py-6 px-4">
      <style>{pageStyles}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            {Icons.back}
            <span className="font-medium">Dashboard</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={runAnalysis}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {Icons.refresh}
              Re-analyze
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              {Icons.save}
              Save Project
            </button>
          </div>
        </div>

        {/* Project Info */}
        {project && (
          <div className="glass-dark rounded-2xl p-6 mb-6 animate-fadeIn">
            <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
            {project.domain && <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">{project.domain}</span>}
            {project.description && <p className="text-gray-400 mt-3">{project.description}</p>}
          </div>
        )}

        {error && (
          <div className="glass-dark rounded-xl p-4 mb-6 border-red-500/50 animate-fadeIn">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hypothesis Card */}
          <div className="lg:col-span-2 result-card rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                {Icons.hypothesis}
              </div>
              <h2 className="text-lg font-bold text-white">Generated Hypothesis</h2>
            </div>
            
            {results.hypothesis ? (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-white text-lg leading-relaxed">{results.hypothesis.hypothesis}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Rationale</h4>
                    <p className="text-gray-300 text-sm">{results.hypothesis.rationale}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Falsification Criteria</h4>
                    <p className="text-gray-300 text-sm">{results.hypothesis.falsification}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No hypothesis generated yet.</p>
            )}
          </div>

          {/* Assumptions Card */}
          <div className="result-card rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  {Icons.assumption}
                </div>
                <h2 className="text-lg font-bold text-white">Key Assumptions</h2>
              </div>
              <button
                onClick={regenerateAssumptions}
                disabled={processing || !results.hypothesis}
                className="text-gray-500 hover:text-white transition-colors disabled:opacity-50"
              >
                {Icons.refresh}
              </button>
            </div>
            
            {results.assumptions.length > 0 ? (
              <ul className="space-y-3">
                {results.assumptions.map((a, i) => (
                  <li key={a.id || i} className="flex items-start gap-3 bg-gray-800/30 rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-300 text-sm">{a.assumption}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No assumptions generated yet.</p>
            )}
          </div>

          {/* Failure Modes Card */}
          <div className="result-card rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  {Icons.failure}
                </div>
                <h2 className="text-lg font-bold text-white">Potential Failure Modes</h2>
              </div>
              <button
                onClick={regenerateFailures}
                disabled={processing || !results.hypothesis}
                className="text-gray-500 hover:text-white transition-colors disabled:opacity-50"
              >
                {Icons.refresh}
              </button>
            </div>
            
            {results.failureModes.length > 0 ? (
              <ul className="space-y-3">
                {results.failureModes.map((f, i) => (
                  <li key={f.id || i} className="flex items-start gap-3 bg-gray-800/30 rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-300 text-sm">{f.failure}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No failure modes generated yet.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by Gemini AI • Results are AI-generated and should be validated</p>
        </div>
      </div>
    </div>
  )
}