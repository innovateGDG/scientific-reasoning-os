
const db = require("../config/db")
const bcrypt = require("bcrypt")
const { OAuth2Client } = require("google-auth-library")
const jwt = require("jsonwebtoken")

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const crypto = require("crypto")

const nodemailer = require("nodemailer")
const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const sql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "User already exists"
        })
      }

      // 🔐 GENERATE JWT HERE (IMPORTANT)
      const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )

      // ✅ SEND TOKEN IN RESPONSE
      return res.status(201).json({
        message: "User registered successfully",
        token
      })
    })
  } catch (err) {
    return res.status(500).json({ message: "Registration failed" })
  }
}



exports.loginUser = (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const sql = "SELECT * FROM users WHERE email = ?"

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" })
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" })
    }

    const user = results[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.status(200).json({
      message: "Login successful",
      token
    })
  })
}



exports.googleLogin = async (req, res) => {
  const { token } = req.body

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const email = payload.email
    const name = payload.name

    // Check if user exists
    const sql = "SELECT * FROM users WHERE email = ?"

    db.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }

      let userId

      if (results.length === 0) {
        // Create new user (Google users don't need password)
        const dummyPassword = await bcrypt.hash("google_login", 10)

        const insertSql =
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"

        db.query(insertSql, [name, email, dummyPassword], (err, result) => {
          if (err) {
            return res.status(500).json({ message: "User creation failed" })
          }

          userId = result.insertId
          sendToken()
        })
      } else {
        userId = results[0].id
        sendToken()
      }

      function sendToken() {
        const jwtToken = jwt.sign(
          { id: userId, email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        )

        res.json({
          message: "Google login successful",
          token: jwtToken
        })
      }
    })
  } catch (err) {
    res.status(401).json({ message: "Google authentication failed" })
  }
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})



exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // 1️⃣ check user
    const users = await query(
      "SELECT otp_last_sent FROM users WHERE email = ?",
      [email]
    )

    if (users.length === 0) {
      return res.status(400).json({ message: "Email not found" })
    }

    const user = users[0]

    // 2️⃣ resend cooldown
    if (user.otp_last_sent) {
      const diff =
        (Date.now() - new Date(user.otp_last_sent).getTime()) / 1000

      if (diff < 60) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(60 - diff)} seconds`
        })
      }
    }

    // 3️⃣ generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = await bcrypt.hash(otp, 10)
    const expiry = new Date(Date.now() + 10 * 60 * 1000)



    // 4️⃣ update DB
    await query(
      `UPDATE users
       SET reset_otp = ?, reset_otp_expiry = ?, otp_last_sent = NOW()
       WHERE email = ?`,
      [hashedOtp, expiry, email]
    )

    // 5️⃣ send mail
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .content { background-color: #ffffff; padding: 20px; border-radius: 5px; }
            .otp-box { background-color: #e8f4f8; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 2px; }
            .footer { color: #777; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              
              <p>We received a request to reset the password for your Scientific Reasoning account.</p>
              
              <p><strong>Your One-Time Password (OTP) is:</strong></p>
              
              <div class="otp-box">${otp}</div>
              
              <p><strong>Validity:</strong> This OTP is valid for 10 minutes only.</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Please do not share this code with anyone. Scientific Reasoning Team will never ask for your OTP.
              </div>
              
              <p>If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
              
              <p>Regards,<br>
              <strong>Scientific Reasoning Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP - Scientific Reasoning",
      html: emailTemplate
    })

    // 6️⃣ success
    res.json({ message: "OTP sent to your email" })

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err)
    res.status(500).json({ message: "Failed to send OTP email" })
  }
}



exports.verifyOtpAndReset = async (req, res) => {
  const { email, otp, password } = req.body

  const sql =
    "SELECT reset_otp, reset_otp_expiry FROM users WHERE email = ?"

  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Invalid request" })
    }

    const user = results[0]

    if (new Date(user.reset_otp_expiry) < new Date()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    const isMatch = await bcrypt.compare(otp, user.reset_otp)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const updateSql =
      "UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expiry = NULL WHERE email = ?"

    db.query(updateSql, [hashedPassword, email], () => {
      res.json({ message: "Password reset successful" })
    })
  })
}


/*
exports.resetPassword = async (req, res) => {
 const { token } = req.params
 const { password } = req.body

 if (!password) {
   return res.status(400).json({ message: "Password is required" })
 }

   const hashedPassword = await bcrypt.hash(password, 10)

   const sql =
     "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ? AND reset_token_expiry > NOW()"

   db.query(sql, [hashedPassword, token], (err, result) => {
     if (err) {
       return res.status(500).json({ message: "Server error" })
     }

     if (result.affectedRows === 0) {
       return res.status(400).json({ message: "Invalid or expired token" })
     }

     res.json({ message: "Password reset successful" })
   })
 }*/