import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import GlobalStyles from "./components/GlobalStyles"
import { AuthRoute, ProtectedRoute, ProfileRequiredRoute } from "./components/ProtectedRoute"

import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfileSetupPage from "./pages/ProfileSetupPage"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Dashboard from "./pages/Dashboard"
import ProfileViewPage from "./pages/ProfileViewPage"
import ProfileEditPage from "./pages/ProfileEditPage"
import AIWorkspace from "./pages/AIWorkspace"

const RootRedirect = () => {
  const token = localStorage.getItem("token")
  const profileDone = localStorage.getItem("profileDone") === "true"

  if (!token) return <Navigate to="/login" replace />
  if (!profileDone) return <Navigate to="/profile-setup" replace />

  return <Navigate to="/dashboard" replace />
}

// Root redirect


const App = () => {
  return (
    <ThemeProvider>
      <GlobalStyles />
     <BrowserRouter>
  <Routes>

    {/* Always start here */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* STEP 1: Auth */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* STEP 2: Profile Setup */}
    <Route path="/profile-setup" element={<ProfileSetupPage />} />

    {/* STEP 3: Dashboard */}
    <Route path="/dashboard" element={<Dashboard />} />

    {/* STEP 4: Project / AI */}
    <Route path="/project/new" element={<AIWorkspace />} />
    <Route path="/workspace/:ingestId" element={<AIWorkspace />} />

    {/* Optional profile pages */}
    <Route path="/profile" element={<ProfileViewPage />} />
    <Route path="/profile/edit" element={<ProfileEditPage />} />

  </Routes>
</BrowserRouter>

    </ThemeProvider>
  )
}

export default App
