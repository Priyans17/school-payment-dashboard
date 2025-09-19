const express = require("express")
const Order = require("../models/Order")
const OrderStatus = require("../models/OrderStatus")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Create dummy data for testing UI
router.post("/create-dummy-data", authenticateToken, async (req, res) => {
  try {
    const now = Date.now()
    const samples = [
      { amount: 1200, status: "success" },
      { amount: 800, status: "pending" },
      { amount: 1500, status: "failed" },
    ]

    const created = []

    for (const [index, sample] of samples.entries()) {
      const custom_order_id = `EDV${now}${index}`
      const order = await Order.create({
        school_id: process.env.SCHOOL_ID || "DEMO_SCHOOL",
        trustee_id: req.user._id,
        student_info: {
          name: `Student ${index + 1}`,
          id: `STU${index + 1}`,
          email: `student${index + 1}@example.com`,
        },
        gateway_name: "Edviron",
        custom_order_id,
        order_amount: sample.amount,
      })

      await OrderStatus.create({
        collect_id: order._id,
        order_amount: sample.amount,
        transaction_amount: sample.amount,
        status: sample.status,
      })

      created.push({ custom_order_id, amount: sample.amount, status: sample.status })
    }

    res.json({ success: true, created })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create dummy data", error: error.message })
  }
})

module.exports = router


