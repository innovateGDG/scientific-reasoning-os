const db = require("../config/db")

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })

// Create Project
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id
    const { title, domain, description, stage } = req.body

    if (!title || !domain) {
      return res.status(400).json({
        success: false,
        message: "Title and domain are required"
      })
    }

    const result = await query(
      `INSERT INTO projects (user_id, title, domain, description, stage) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, domain, description || null, stage || "Hypothesis"]
    )

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      projectId: result.insertId
    })

  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to create project"
    })
  }
}

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id

    const projects = await query(
      `SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC`,
      [userId]
    )

    res.status(200).json({
      success: true,
      projects
    })

  } catch (err) {
    console.error("GET PROJECTS ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    })
  }
}

// Get Single Project
exports.getProject = async (req, res) => {
  try {
    const userId = req.user.id
    const { projectId } = req.params

    const projects = await query(
      `SELECT * FROM projects WHERE id = ? AND user_id = ?`,
      [projectId, userId]
    )

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      })
    }

    res.status(200).json({
      success: true,
      project: projects[0]
    })

  } catch (err) {
    console.error("GET PROJECT ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch project"
    })
  }
}

// Toggle Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { projectId } = req.params

    const projects = await query(
      `SELECT is_favorite FROM projects WHERE id = ? AND user_id = ?`,
      [projectId, userId]
    )

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      })
    }

    const newStatus = !projects[0].is_favorite

    await query(
      `UPDATE projects SET is_favorite = ? WHERE id = ?`,
      [newStatus, projectId]
    )

    res.status(200).json({
      success: true,
      isFavorite: newStatus
    })

  } catch (err) {
    console.error("TOGGLE FAVORITE ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to update favorite status"
    })
  }
}