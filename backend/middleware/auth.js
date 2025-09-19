const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    
    // Handle both MongoDB and memory storage
    let user
    if (User.findById) {
      // MongoDB
      user = await User.findById(decoded.userId).select("-password")
    } else {
      // Memory storage
      user = await User.findOne({ _id: decoded.userId })
      if (user) {
        delete user.password
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}

module.exports = { authenticateToken }
