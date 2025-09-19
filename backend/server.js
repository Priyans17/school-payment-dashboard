const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const axios = require("axios")
require("dotenv").config()

const app = express()

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const connectDB = async () => {
  try {
    // Try local MongoDB first
    await mongoose.connect("mongodb://localhost:27017/school-payments", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to local MongoDB")
  } catch (localError) {
    try {
      // Try MongoDB Atlas if local fails
      await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://demo:demo@cluster0.mongodb.net/school-payments?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log("✅ Connected to MongoDB Atlas")
    } catch (atlasError) {
      console.log("⚠️ MongoDB not available, using in-memory storage")
      console.log("💡 To use MongoDB: Install MongoDB locally or set MONGODB_URI")
    }
  }
}

connectDB()

// Import routes
const authRoutes = require("./routes/auth")
const paymentRoutes = require("./routes/payment")
const orderRoutes = require("./routes/order")
const transactionRoutes = require("./routes/transaction")
const webhookRoutes = require("./routes/webhook")

// Use routes
app.use("/api/auth", authRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/transaction-status", transactionRoutes)
app.use("/api/webhook", webhookRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "School Payment API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`🚀 School Payment API running on port ${PORT}`)
})

module.exports = app
