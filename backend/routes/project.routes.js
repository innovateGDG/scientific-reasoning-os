const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")

const {
  createProject,
  getProjects,
  getProject,
  toggleFavorite
} = require("../controllers/project.controller")

router.use(authMiddleware)

router.post("/", createProject)
router.get("/", getProjects)
router.get("/:projectId", getProject)
router.post("/:projectId/favorite", toggleFavorite)

module.exports = router