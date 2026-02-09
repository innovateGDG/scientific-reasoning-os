const express = require("express")
const cors = require("cors")
require("dotenv").config()

const db = require("./config/db")
const authRoutes = require("./routes/auth.routes")
const profileRoutes = require("./routes/profile.routes")  // Add this
const projectRoutes = require("./routes/project.routes")
const app = express()

// ✅ CORS Configuration
app.use(cors({
  origin: "http://localhost:5177",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// ✅ Handle Preflight
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5177")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }

  next()
})

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend is running")
})
app.use("/api/projects", projectRoutes)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)  // Add this

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})