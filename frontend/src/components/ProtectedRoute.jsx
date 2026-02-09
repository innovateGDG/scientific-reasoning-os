import { Navigate } from "react-router-dom"

/**
 * Requires login only
 */
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * Requires login + completed profile
 */
export function ProfileRequiredRoute({ children }) {
  const token = localStorage.getItem("token")
  const profileComplete = localStorage.getItem("profileComplete") === "true"

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!profileComplete) {
    return <Navigate to="/profile-setup" replace />
  }

  return children
}

/**
 * Auth pages (login/register)
 * Redirect if already logged in
 */
export function AuthRoute({ children }) {
  const token = localStorage.getItem("token")
  const profileComplete = localStorage.getItem("profileComplete") === "true"

  if (token && profileComplete) {
    return <Navigate to="/dashboard" replace />
  }

  if (token && !profileComplete) {
    return <Navigate to="/profile-setup" replace />
  }

  return children
}
