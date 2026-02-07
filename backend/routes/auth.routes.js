const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/auth.middleware")

const {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  verifyOtpAndReset
} = require("../controllers/auth.controller")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/google-login", googleLogin)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp-reset", verifyOtpAndReset)

// 🔐 Protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data accessed",
    user: req.user
  })
})

module.exports = router
