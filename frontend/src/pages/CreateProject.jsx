import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createProject } from "../Services/api"

export default function CreateProject() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    domain: "",
    problemType: "", // hypothesis | assumption | failure
    description: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.title || !form.problemType) {
      setError("Project title and problem type are required")
      return
    }

    try {
      setLoading(true)

      const res = await createProject(form)

      if (!res.success) {
        setError(res.message || "Failed to create project")
        return
      }

      // ✅ Go to AI workspace with project id
      navigate(`/ai/${res.project.id}`)
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* UI neenga design pannunga */}
      <input
        name="title"
        placeholder="Project Title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        name="domain"
        placeholder="Research / Engineering Domain"
        value={form.domain}
        onChange={handleChange}
      />

      <select
        name="problemType"
        value={form.problemType}
        onChange={handleChange}
      >
        <option value="">Select Problem Type</option>
        <option value="Hypothesis">Hypothesis Generation</option>
        <option value="Assumption">Assumption Tracking</option>
        <option value="Failure">Failure Analysis</option>
      </select>

      <textarea
        name="description"
        placeholder="Describe the problem context"
        value={form.description}
        onChange={handleChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  )
}
