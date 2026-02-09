// ==================================================
// BASE CONFIG
// ==================================================
const NODE_API_URL = "http://localhost:5001/api"   // Auth, Profile, Projects
const PYTHON_API_URL = "http://localhost:8000"     // AI, Pipeline

// ==================================================
// AUTH HEADER HELPER
// ==================================================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
}

// ==================================================
// AUTH APIs (Node.js)
// ==================================================

export const registerUser = async (data) => {
  const res = await fetch(`${NODE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const loginUser = async (data) => {
  const res = await fetch(`${NODE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const googleLogin = async (token) => {
  const res = await fetch(`${NODE_API_URL}/auth/google-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  })
  return res.json()
}

export const forgotPassword = async (email) => {
  const res = await fetch(`${NODE_API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  return res.json()
}

export const verifyOtpAndReset = async (data) => {
  const res = await fetch(`${NODE_API_URL}/auth/verify-otp-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}

// ==================================================
// PROFILE APIs (Node.js)
// ==================================================

export const saveProfile = async (profileData) => {
  try {
    const res = await fetch(`${NODE_API_URL}/profile/save`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    return res.json()
  } catch (err) {
    console.error("Save profile error:", err)
    return { success: false }
  }
}

export const getProfile = async () => {
  try {
    const res = await fetch(`${NODE_API_URL}/profile`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Get profile error:", err)
    return { success: false }
  }
}

export const checkProfileStatus = async () => {
  try {
    const res = await fetch(`${NODE_API_URL}/profile/status`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Check profile status error:", err)
    return { success: false }
  }
}

// Backward compatibility (used by older login flow)
export const checkProfileComplete = async () => {
  const result = await checkProfileStatus()
  return { profileComplete: result.profileComplete || result.success }
}

export const deleteProfile = async () => {
  try {
    const res = await fetch(`${NODE_API_URL}/profile`, {
      method: "DELETE",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Delete profile error:", err)
    return { success: false }
  }
}

// ==================================================
// PROJECT APIs (Node.js)
// ==================================================

export const createProject = async (projectData) => {
  try {
    const res = await fetch(`${NODE_API_URL}/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    })
    return res.json()
  } catch (err) {
    console.error("Create project error:", err)
    return { success: false }
  }
}

export const getProjects = async () => {
  try {
    const res = await fetch(`${NODE_API_URL}/projects`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Get projects error:", err)
    return { projects: [] }
  }
}

export const getProject = async (projectId) => {
  try {
    const res = await fetch(`${NODE_API_URL}/projects/${projectId}`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Get project error:", err)
    return { success: false }
  }
}

export const updateProject = async (projectId, data) => {
  try {
    const res = await fetch(`${NODE_API_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return res.json()
  } catch (err) {
    console.error("Update project error:", err)
    return { success: false }
  }
}

export const deleteProject = async (projectId) => {
  try {
    const res = await fetch(`${NODE_API_URL}/projects/${projectId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Delete project error:", err)
    return { success: false }
  }
}

export const toggleFavorite = async (projectId) => {
  try {
    const res = await fetch(`${NODE_API_URL}/projects/${projectId}/favorite`, {
      method: "POST",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Toggle favorite error:", err)
    return { success: false }
  }
}

export const getRecentActivity = async () => {
  try {
    const res = await fetch(`${NODE_API_URL}/activity/recent`, {
      method: "GET",
      headers: getAuthHeaders()
    })
    return res.json()
  } catch (err) {
    console.error("Get activity error:", err)
    return { activities: [] }
  }
}

// ==================================================
// AI / PIPELINE APIs (Python Backend)
// ==================================================

export const ingestText = async (title, text) => {
  const res = await fetch(`${PYTHON_API_URL}/ingest/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text })
  })
  return res.json()
}

export const ingestPaper = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${PYTHON_API_URL}/ingest/paper`, {
    method: "POST",
    body: formData
  })
  return res.json()
}

export const generateHypothesis = async (context) => {
  const res = await fetch(`${PYTHON_API_URL}/hypothesis/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context })
  })
  return res.json()
}

export const generateAssumptions = async (hypothesisId) => {
  const res = await fetch(`${PYTHON_API_URL}/assumptions/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hypothesis_id: hypothesisId })
  })
  return res.json()
}

export const generateFailureModes = async (hypothesisId) => {
  const res = await fetch(`${PYTHON_API_URL}/failure/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hypothesis_id: hypothesisId })
  })
  return res.json()
}

export const runPipeline = async (ingestId) => {
  const res = await fetch(`${PYTHON_API_URL}/pipeline/from-ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingest_id: ingestId })
  })
  return res.json()
}

export const checkPythonBackend = async () => {
  const res = await fetch(`${PYTHON_API_URL}/`)
  return res.json()
}
