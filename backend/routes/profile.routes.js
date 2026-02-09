const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")

const {
  saveProfile,
  getProfile,
  checkProfileStatus,
  deleteProfile
} = require("../controllers/profile.controller")

// All routes are protected
router.use(authMiddleware)

// Save or update profile
router.post("/save", saveProfile)

// Get profile
router.get("/", getProfile)

// Check profile status
router.get("/status", checkProfileStatus)

// Delete profile
router.delete("/", deleteProfile)

module.exports = router