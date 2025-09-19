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
    const { student_info, amount, callback_url } = req.body
    const order_amount = amount

    // Generate custom order ID
    const custom_order_id = `EDV${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Create order in database
    const order = new Order({
      school_id: process.env.SCHOOL_ID || "65b0e6293e9f76a9694d84b4",
      trustee_id: req.user._id,
      student_info,
      gateway_name: "Edviron",
      custom_order_id,
      order_amount,
      status: "pending_approval", // New status for approval workflow
      created_by: req.user._id,
    })

    const savedOrder = await order.save()

    // Create initial order status
    const orderStatus = new OrderStatus({
      collect_id: savedOrder._id,
      order_amount,
      transaction_amount: order_amount,
      status: "pending_approval",
      payment_mode: "NA",
      payment_time: null,
    })

    await orderStatus.save()

    res.json({
      success: true,
      message: "Payment request created successfully. Waiting for approval.",
      custom_order_id,
      collect_request_id: savedOrder._id,
      status: "pending_approval",
      requires_approval: true,
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

// Auto-approve payment (for testing or specific conditions)
router.post("/auto-approve/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params
    
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    // Update order status
    order.status = "approved"
    await order.save()

    // Update order status
    const orderStatus = await OrderStatus.findOne({ collect_id: orderId })
    if (orderStatus) {
      orderStatus.status = "pending"
      await orderStatus.save()
    }

    res.json({
      success: true,
      message: "Payment auto-approved successfully",
      order_id: orderId,
      status: "approved"
    })
  } catch (error) {
    console.error("Auto-approval error:", error)
    res.status(500).json({
      success: false,
      message: "Auto-approval failed",
      error: error.message
    })
  }
})

// Admin approve payment
router.post("/admin-approve/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params
    const { approved } = req.body
    
    // Check if user is admin (you can implement proper admin check)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      })
    }
    
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    if (approved) {
      // Approve the payment
      order.status = "approved"
      await order.save()

      const orderStatus = await OrderStatus.findOne({ collect_id: orderId })
      if (orderStatus) {
        orderStatus.status = "pending"
        await orderStatus.save()
      }

      res.json({
        success: true,
        message: "Payment approved successfully",
        order_id: orderId,
        status: "approved"
      })
    } else {
      // Reject the payment
      order.status = "rejected"
      await order.save()

      const orderStatus = await OrderStatus.findOne({ collect_id: orderId })
      if (orderStatus) {
        orderStatus.status = "failed"
        await orderStatus.save()
      }

      res.json({
        success: true,
        message: "Payment rejected",
        order_id: orderId,
        status: "rejected"
      })
    }
  } catch (error) {
    console.error("Admin approval error:", error)
    res.status(500).json({
      success: false,
      message: "Approval process failed",
      error: error.message
    })
  }
})

// Check payment status
router.get("/status/:collectRequestId", authenticateToken, async (req, res) => {
  try {
    const { collectRequestId } = req.params
    
    const orderStatus = await OrderStatus.findOne({ collect_id: collectRequestId })
    
    // For memory storage, we need to manually populate
    if (orderStatus && !orderStatus.collect_id.populate) {
      const order = await Order.findOne({ _id: collectRequestId })
      orderStatus.collect_id = order
    }
    
    if (!orderStatus) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      })
    }

    res.json({
      success: true,
      data: orderStatus
    })
  } catch (error) {
    console.error("Status check error:", error)
    res.status(500).json({
      success: false,
      message: "Status check failed",
      error: error.message
    })
  }
})

module.exports = router
