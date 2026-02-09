const db = require("../config/db")

// Helper function for promises
const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })

// Save or Update Profile
exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const {
      role,
      // Personal Information
      fullName,
      gender,
      dob,
      email,
      phone,
      linkedin,
      // Location & Organization
      city,
      country,
      timezone,
      organization,
      department,
      position,
      // Bio & Preferences
      bio,
      skills,
      website,
      // Researcher fields
      primaryResearchDomain,
      yearsOfExperience,
      researchFocus,
      publicationsCount,
      hIndex,
      // R&D Engineer fields
      engineeringDomain,
      industrySector,
      problemTypePreference,
      yearsInRD,
      patentsFiled,
      innovationStage,
      // Scientist fields
      scientificDiscipline,
      labBackground,
      dataPreference,
      yearsInResearch,
      highestDegree,
      researchInterests,
      // Product Analyst fields
      productDomain,
      researchGoal,
      outputPreference,
      yearsInAnalysis,
      dataExpertise,
      analyticsTools
    } = req.body

    // Validate required fields
    if (!role || !fullName || !gender || !dob || !city || !country || !department || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      })
    }

    // Check if profile already exists
    const existingProfile = await query(
      "SELECT id FROM profiles WHERE user_id = ?",
      [userId]
    )

    if (existingProfile.length > 0) {
      // Update existing profile
      const updateSql = `
        UPDATE profiles SET
          role = ?,
          full_name = ?,
          gender = ?,
          dob = ?,
          email = ?,
          phone = ?,
          linkedin = ?,
          city = ?,
          country = ?,
          timezone = ?,
          organization = ?,
          department = ?,
          position = ?,
          bio = ?,
          skills = ?,
          website = ?,
          primary_research_domain = ?,
          years_of_experience = ?,
          research_focus = ?,
          publications_count = ?,
          h_index = ?,
          engineering_domain = ?,
          industry_sector = ?,
          problem_type_preference = ?,
          years_in_rd = ?,
          patents_filed = ?,
          innovation_stage = ?,
          scientific_discipline = ?,
          lab_background = ?,
          data_preference = ?,
          years_in_research = ?,
          highest_degree = ?,
          research_interests = ?,
          product_domain = ?,
          research_goal = ?,
          output_preference = ?,
          years_in_analysis = ?,
          data_expertise = ?,
          analytics_tools = ?,
          is_complete = TRUE
        WHERE user_id = ?
      `

      await query(updateSql, [
        role,
        fullName,
        gender,
        dob,
        email,
        phone,
        linkedin || null,
        city,
        country,
        timezone || null,
        organization || null,
        department,
        position || null,
        bio || null,
        skills || null,
        website || null,
        primaryResearchDomain || null,
        yearsOfExperience || null,
        researchFocus || null,
        publicationsCount || null,
        hIndex || null,
        engineeringDomain || null,
        industrySector || null,
        problemTypePreference || null,
        yearsInRD || null,
        patentsFiled || null,
        innovationStage || null,
        scientificDiscipline || null,
        labBackground || null,
        dataPreference || null,
        yearsInResearch || null,
        highestDegree || null,
        researchInterests || null,
        productDomain || null,
        researchGoal || null,
        outputPreference || null,
        yearsInAnalysis || null,
        dataExpertise || null,
        analyticsTools || null,
        userId
      ])

    } else {
      // Insert new profile
      const insertSql = `
        INSERT INTO profiles (
          user_id,
          role,
          full_name,
          gender,
          dob,
          email,
          phone,
          linkedin,
          city,
          country,
          timezone,
          organization,
          department,
          position,
          bio,
          skills,
          website,
          primary_research_domain,
          years_of_experience,
          research_focus,
          publications_count,
          h_index,
          engineering_domain,
          industry_sector,
          problem_type_preference,
          years_in_rd,
          patents_filed,
          innovation_stage,
          scientific_discipline,
          lab_background,
          data_preference,
          years_in_research,
          highest_degree,
          research_interests,
          product_domain,
          research_goal,
          output_preference,
          years_in_analysis,
          data_expertise,
          analytics_tools,
          is_complete
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
      `

      await query(insertSql, [
        userId,
        role,
        fullName,
        gender,
        dob,
        email,
        phone,
        linkedin || null,
        city,
        country,
        timezone || null,
        organization || null,
        department,
        position || null,
        bio || null,
        skills || null,
        website || null,
        primaryResearchDomain || null,
        yearsOfExperience || null,
        researchFocus || null,
        publicationsCount || null,
        hIndex || null,
        engineeringDomain || null,
        industrySector || null,
        problemTypePreference || null,
        yearsInRD || null,
        patentsFiled || null,
        innovationStage || null,
        scientificDiscipline || null,
        labBackground || null,
        dataPreference || null,
        yearsInResearch || null,
        highestDegree || null,
        researchInterests || null,
        productDomain || null,
        researchGoal || null,
        outputPreference || null,
        yearsInAnalysis || null,
        dataExpertise || null,
        analyticsTools || null
      ])
    }

    // Update user's profile_complete status and role
    await query(
      "UPDATE users SET profile_complete = TRUE, role = ? WHERE id = ?",
      [role, userId]
    )

    res.status(200).json({
      success: true,
      message: "Profile saved successfully"
    })

  } catch (err) {
    console.error("SAVE PROFILE ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to save profile"
    })
  }
}

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const profiles = await query(
      "SELECT * FROM profiles WHERE user_id = ?",
      [userId]
    )

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      })
    }

    const profile = profiles[0]

    // Convert snake_case to camelCase for frontend
    const formattedProfile = {
      id: profile.id,
      userId: profile.user_id,
      role: profile.role,
      fullName: profile.full_name,
      gender: profile.gender,
      dob: profile.dob,
      email: profile.email,
      phone: profile.phone,
      linkedin: profile.linkedin,
      city: profile.city,
      country: profile.country,
      timezone: profile.timezone,
      organization: profile.organization,
      department: profile.department,
      position: profile.position,
      bio: profile.bio,
      skills: profile.skills,
      website: profile.website,
      primaryResearchDomain: profile.primary_research_domain,
      yearsOfExperience: profile.years_of_experience,
      researchFocus: profile.research_focus,
      publicationsCount: profile.publications_count,
      hIndex: profile.h_index,
      engineeringDomain: profile.engineering_domain,
      industrySector: profile.industry_sector,
      problemTypePreference: profile.problem_type_preference,
      yearsInRD: profile.years_in_rd,
      patentsFiled: profile.patents_filed,
      innovationStage: profile.innovation_stage,
      scientificDiscipline: profile.scientific_discipline,
      labBackground: profile.lab_background,
      dataPreference: profile.data_preference,
      yearsInResearch: profile.years_in_research,
      highestDegree: profile.highest_degree,
      researchInterests: profile.research_interests,
      productDomain: profile.product_domain,
      researchGoal: profile.research_goal,
      outputPreference: profile.output_preference,
      yearsInAnalysis: profile.years_in_analysis,
      dataExpertise: profile.data_expertise,
      analyticsTools: profile.analytics_tools,
      isComplete: profile.is_complete,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    }

    res.status(200).json({
      success: true,
      profile: formattedProfile
    })

  } catch (err) {
    console.error("GET PROFILE ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    })
  }
}

// Check if profile is complete
exports.checkProfileStatus = async (req, res) => {
  try {
    const userId = req.user.id

    const users = await query(
      "SELECT profile_complete, role FROM users WHERE id = ?",
      [userId]
    )

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      profileComplete: users[0].profile_complete || false,
      role: users[0].role || null
    })

  } catch (err) {
    console.error("CHECK PROFILE STATUS ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to check profile status"
    })
  }
}

// Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id

    await query("DELETE FROM profiles WHERE user_id = ?", [userId])
    await query(
      "UPDATE users SET profile_complete = FALSE, role = NULL WHERE id = ?",
      [userId]
    )

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    })

  } catch (err) {
    console.error("DELETE PROFILE ERROR:", err)
    res.status(500).json({
      success: false,
      message: "Failed to delete profile"
    })
  }
}