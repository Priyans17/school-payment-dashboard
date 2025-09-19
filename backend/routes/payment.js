const express = require("express")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const Order = require("../models/Order")
const OrderStatus = require("../models/OrderStatus")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Create payment
router.post("/create-payment", authenticateToken, async (req, res) => {
  try {
    const { student_info } = req.body
    const order_amount = req.body.order_amount ?? req.body.amount

    // Generate custom order ID
    const custom_order_id = `EDV${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Create order in database
    const order = new Order({
      school_id: process.env.SCHOOL_ID,
      trustee_id: req.user._id,
      student_info,
      gateway_name: "Edviron",
      custom_order_id,
      order_amount,
    })

    await order.save()

    // Create initial order status
    const orderStatus = new OrderStatus({
      collect_id: order._id,
      order_amount,
      transaction_amount: order_amount,
      status: "pending",
    })

    await orderStatus.save()

    // Prepare payment API payload
    const paymentPayload = {
      school_id: process.env.SCHOOL_ID,
      custom_order_id,
      order_amount,
      student_info,
      gateway: "PhonePe",
    }

    // Sign JWT payload for payment API
    const jwtPayload = jwt.sign(paymentPayload, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" })

    // Call payment API
    const paymentResponse = await axios.post(
      `${process.env.PAYMENT_API_URL}/create-collect-request`,
      { payload: jwtPayload },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
          "Content-Type": "application/json",
          pg_key: process.env.PG_KEY,
        },
      },
    )

    res.json({
      success: true,
      message: "Payment created successfully",
      order_id: custom_order_id,
      collect_id: order._id,
      payment_url: paymentResponse.data.payment_url || paymentResponse.data.redirect_url,
      payment_data: paymentResponse.data,
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    res.status(500).json({
      success: false,
      message: "Payment creation failed",
      error: error.response?.data || error.message,
    })
  }
})

module.exports = router
