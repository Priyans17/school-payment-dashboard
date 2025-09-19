const express = require("express")
const Order = require("../models/Order")
const OrderStatus = require("../models/OrderStatus")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get all transactions with aggregation
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, school_id, sort = "createdAt", order = "desc" } = req.query

    // Build match conditions
    const matchConditions = {}
    if (status && status !== "all") {
      matchConditions["orderStatus.status"] = status
    }
    if (school_id) {
      matchConditions.school_id = school_id
    }

    // Build sort object
    const sortObj = {}
    sortObj[sort] = order === "desc" ? -1 : 1

    const transactions = await Order.aggregate([
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "orderStatus",
        },
      },
      {
        $unwind: {
          path: "$orderStatus",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchConditions,
      },
      {
        $project: {
          collect_id: "$_id",
          school_id: 1,
          gateway: "$gateway_name",
          order_amount: 1,
          transaction_amount: "$orderStatus.transaction_amount",
          status: "$orderStatus.status",
          custom_order_id: 1,
          student_info: 1,
          payment_mode: "$orderStatus.payment_mode",
          payment_time: "$orderStatus.payment_time",
          createdAt: 1,
        },
      },
      {
        $sort: sortObj,
      },
      {
        $skip: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      },
      {
        $limit: Number.parseInt(limit),
      },
    ])

    // Get total count
    const totalCount = await Order.countDocuments()

    res.json({
      success: true,
      data: transactions,
      pagination: {
        current_page: Number.parseInt(page),
        per_page: Number.parseInt(limit),
        total: totalCount,
        total_pages: Math.ceil(totalCount / Number.parseInt(limit)),
      },
    })
  } catch (error) {
    console.error("Get transactions error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    })
  }
})

// Get transactions by school
router.get("/school/:schoolId", authenticateToken, async (req, res) => {
  try {
    const { schoolId } = req.params
    const { page = 1, limit = 10 } = req.query

    const transactions = await Order.aggregate([
      {
        $match: { school_id: schoolId },
      },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "orderStatus",
        },
      },
      {
        $unwind: {
          path: "$orderStatus",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          collect_id: "$_id",
          school_id: 1,
          gateway: "$gateway_name",
          order_amount: 1,
          transaction_amount: "$orderStatus.transaction_amount",
          status: "$orderStatus.status",
          custom_order_id: 1,
          student_info: 1,
          payment_mode: "$orderStatus.payment_mode",
          payment_time: "$orderStatus.payment_time",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      },
      {
        $limit: Number.parseInt(limit),
      },
    ])

    res.json({
      success: true,
      data: transactions,
      school_id: schoolId,
    })
  } catch (error) {
    console.error("Get school transactions error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch school transactions",
      error: error.message,
    })
  }
})

// Check transaction status
router.get("/status/:customOrderId", authenticateToken, async (req, res) => {
  try {
    const { customOrderId } = req.params

    const order = await Order.findOne({ custom_order_id: customOrderId })
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    const orderStatus = await OrderStatus.findOne({ collect_id: order._id })

    res.json({
      success: true,
      data: {
        custom_order_id: customOrderId,
        collect_id: order._id,
        status: orderStatus?.status || "pending",
        order_amount: order.order_amount,
        transaction_amount: orderStatus?.transaction_amount || order.order_amount,
        payment_mode: orderStatus?.payment_mode || "NA",
        payment_time: orderStatus?.payment_time,
        student_info: order.student_info,
      },
    })
  } catch (error) {
    console.error("Check status error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to check transaction status",
      error: error.message,
    })
  }
})

module.exports = router
