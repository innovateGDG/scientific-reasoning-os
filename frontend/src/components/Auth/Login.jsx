import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { loginUser } from "../../Services/api"
import { GoogleLogin } from "@react-oauth/google"
import ThemeToggle from "../ThemeToggle"

export default function Login() {
  // CSS for styling select placeholder to match input placeholders
  const selectPlaceholderStyle = `
    select option:disabled {
      color: #9ca3af;
      font-weight: 400;
    }
    select option {
      color: #1f2937;
      font-weight: 400;
    }
  `

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const redirectAfterLogin = () => {
    navigate("/profile-setup", { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await loginUser({
        email: email.trim().toLowerCase(),
        password
      })

      if (res.token) {
        localStorage.setItem("token", res.token)
        redirectAfterLogin()
      } else {
        setMessage(res.message || "Login failed")
      }
    } catch {
      setMessage("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://image.slidesdocs.com/responsive-images/background/blue-science-light-technology-intelligent-powerpoint-background_ca134222dd__960_540.jpg')"
      }}
    >
      <style>{selectPlaceholderStyle}</style>
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* THEME TOGGLE */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* MAIN CARD */}
      <div className="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl
                      shadow-2xl rounded-3xl overflow-hidden
                      flex flex-col md:flex-row">

        {/* LEFT IMAGE */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="https://image.slidesdocs.com/responsive-images/background/blue-science-light-technology-intelligent-powerpoint-background_ca134222dd__960_540.jpg"
            alt="science"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl font-bold text-white">
              Welcome to
            </h1>
            <h2 className="text-3xl font-semibold text-indigo-300 mt-2">
              Scientific Reasoning
            </h2>
            <p className="text-sm text-gray-200 mt-4 max-w-xs">
              Think logically. Learn scientifically. 
                    Grow intelligently.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm flex flex-col justify-center py-12"

          >
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              Sign in
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Welcome back! Please login to continue
            </p>

            {/* GOOGLE LOGIN */}
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await fetch(
                      "http://localhost:5001/api/auth/google-login",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          token: credentialResponse.credential
                        })
                      }
                    )

                    const data = await res.json()

                    if (!res.ok) {
                      setMessage(data.message || "Google login failed")
                      return
                    }

                      localStorage.setItem("token", data.token)

                        redirectAfterLogin()
                  } catch {
                    setMessage("Google login error")
                  }
                }}
                onError={() => setMessage("Google login cancelled")}
              />
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">
                or login with email
              </span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 px-4 rounded-full border border-gray-300
                         outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-4 h-11 px-4 rounded-full border border-gray-300
                         outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* FORGOT */}
            <div className="flex justify-end mt-3">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 h-11 rounded-full text-white font-medium
              ${loading
                ? "bg-gray-400"
                : "bg-indigo-500 hover:bg-indigo-600"}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* MESSAGE */}
            {message && (
              <p className="text-sm text-center mt-4 text-red-500">
                {message}
              </p>
            )}

            {/* REGISTER */}
            <p className="text-sm text-center text-gray-500 mt-5">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-500 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
