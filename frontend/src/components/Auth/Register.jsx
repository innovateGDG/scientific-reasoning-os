import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { registerUser } from "../../Services/api"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const navigate = useNavigate()
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setError("")
    setMessage("")
    setLoading(true)

    try {
      const res = await registerUser({ name, email, password })

      if (res.token) {
        localStorage.setItem("token", res.token)
        await delay(1000)
        navigate("/dashboard", { replace: true })
      } else {
        setError(res.message || "Registration failed")
      }
    } catch (err) {
      setError(err.message || "Something went wrong")
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
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* MAIN CARD */}
      <div className="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl
                      shadow-2xl rounded-3xl overflow-hidden
                      flex flex-col md:flex-row">

        {/* LEFT IMAGE + TEXT */}
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
              Build your account. Learn smarter. Think deeper.
            </p>
          </div>
        </div>

        {/* RIGHT REGISTER FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm flex flex-col"
          >
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              Sign up
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Create your account to get started
            </p>

            {/* NAME */}
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 px-4 rounded-full border border-gray-300
                         outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-4 h-11 px-4 rounded-full border border-gray-300
                         outline-none focus:ring-2 focus:ring-indigo-400"
              required
              autoComplete="username"
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
              autoComplete="new-password"
            />

            {/* CONFIRM PASSWORD */}
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-4 h-11 px-4 rounded-full border border-gray-300
                         outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {error}
              </p>
            )}

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 h-11 rounded-full text-white font-medium
              ${loading
                ? "bg-gray-400"
                : "bg-indigo-500 hover:bg-indigo-600"}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* MESSAGE */}
            {message && (
              <p className="text-green-600 text-sm mt-3 text-center">
                {message}
              </p>
            )}

            {/* LOGIN LINK */}
            <p className="text-sm text-center text-gray-500 mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-500 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
