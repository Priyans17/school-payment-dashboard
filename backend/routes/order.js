const express = require("express")
const Order = require("../models/Order")
const OrderStatus = require("../models/OrderStatus")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Create dummy data for testing UI
router.post("/create-dummy-data", authenticateToken, async (req, res) => {
  try {
    const institutes = [
      "Delhi Public School", 
      "Kendriya Vidyalaya", 
      "St. Mary's School", 
      "Modern Public School",
      "EDV DEMO SCHOOL"
    ]
    
    const students = [
      { name: "Rohan Sharma", id: "STU001", email: "rohan.sharma@example.com" },
      { name: "Priya Patel", id: "STU002", email: "priya.patel@example.com" },
      { name: "Amit Kumar", id: "STU003", email: "amit.kumar@example.com" },
      { name: "Sneha Singh", id: "STU004", email: "sneha.singh@example.com" },
      { name: "Vikram Gupta", id: "STU005", email: "vikram.gupta@example.com" },
      { name: "Anita Verma", id: "STU006", email: "anita.verma@example.com" },
      { name: "Rajesh Mehta", id: "STU007", email: "rajesh.mehta@example.com" },
      { name: "Sunita Reddy", id: "STU008", email: "sunita.reddy@example.com" },
      { name: "Arjun Nair", id: "STU009", email: "arjun.nair@example.com" },
      { name: "Kavya Iyer", id: "STU010", email: "kavya.iyer@example.com" },
    ]
    
    const statuses = ["success", "pending", "failed"]
    const paymentMethods = ["UPI", "Card", "Net Banking", "Wallet", "NA"]
    const gateways = ["Razorpay", "PhonePe", "PayU", "Razorpay", "NA"]
    
    const amounts = [5000, 7500, 12000, 3500, 8500, 15000, 2500, 9500, 18000, 4200]
    
    const samples = []
    
    // Generate 20 realistic transactions
    for (let i = 0; i < 20; i++) {
      const student = students[Math.floor(Math.random() * students.length)]
      const institute = institutes[Math.floor(Math.random() * institutes.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      const gateway = gateways[Math.floor(Math.random() * gateways.length)]
      const amount = amounts[Math.floor(Math.random() * amounts.length)]
      
      samples.push({
        amount,
        status,
        institute,
        student,
        paymentMethod,
        gateway
      })
    }

    const created = []

    for (const [index, sample] of samples.entries()) {
      const custom_order_id = `EDV${Date.now()}${index.toString().padStart(3, '0')}`
      const order = new Order({
        school_id: sample.institute,
        trustee_id: req.user._id,
        student_info: {
          name: sample.student.name,
          id: sample.student.id,
          email: sample.student.email,
        },
        gateway_name: sample.gateway,
        custom_order_id,
        order_amount: sample.amount,
        status: "approved", // Auto-approve dummy data
        created_by: req.user._id,
      })
      await order.save()

      const orderStatus = new OrderStatus({
        collect_id: order._id,
        order_amount: sample.amount,
        transaction_amount: sample.amount,
        status: sample.status,
        payment_mode: sample.paymentMethod,
        payment_time: sample.status === "success" ? new Date() : null,
      })
      await orderStatus.save()

      created.push({ 
        custom_order_id, 
        amount: sample.amount, 
        status: sample.status,
        institute: sample.institute,
        student: sample.student.name
      })
    }

    res.json({ success: true, created })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create dummy data", error: error.message })
  }
})

// Create raw data manually
router.post("/create-raw-data", authenticateToken, async (req, res) => {
  try {
    const { 
      institute_name, 
      student_name, 
      student_id, 
      student_email, 
      order_amount, 
      transaction_amount, 
      payment_method, 
      status, 
      gateway, 
      phone_number 
    } = req.body

    // Generate custom order ID
    const custom_order_id = `EDV${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Create order in database
    const order = new Order({
      school_id: institute_name || "EDV DEMO SCHOOL",
      trustee_id: req.user._id,
      student_info: {
        name: student_name,
        id: student_id,
        email: student_email,
      },
      gateway_name: gateway || "Edviron",
      custom_order_id,
      order_amount: Number(order_amount),
      status: "approved", // Auto-approve raw data
      created_by: req.user._id,
    })

    const savedOrder = await order.save()

    // Create order status
    const orderStatus = new OrderStatus({
      collect_id: savedOrder._id,
      order_amount: Number(order_amount),
      transaction_amount: Number(transaction_amount) || Number(order_amount),
      status: status || "pending",
      payment_mode: payment_method || "NA",
      payment_time: status === "success" ? new Date() : null,
    })

    await orderStatus.save()

    res.json({
      success: true,
      message: "Raw data created successfully",
      custom_order_id,
      collect_request_id: savedOrder._id,
      status: "created"
    })
  } catch (error) {
    console.error("Raw data creation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create raw data",
      error: error.message
    })
  }
})

// Export data as CSV
router.get("/export", authenticateToken, async (req, res) => {
  try {
    const { format = 'csv', status, start_date, end_date } = req.query

    // Build match conditions
    const matchConditions = {}
    if (status && status !== "all") {
      matchConditions["orderStatus.status"] = status
    }
    if (start_date && end_date) {
      matchConditions.createdAt = {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      }
    }

    let transactions
    if (Order.aggregate) {
      // MongoDB aggregation
      transactions = await Order.aggregate([
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
          $sort: { createdAt: -1 },
        },
      ])
    } else {
      // Memory storage
      const orders = await Order.find()
      const orderStatuses = await OrderStatus.find()
      
      transactions = orders.map(order => {
        const status = orderStatuses.find(s => s.collect_id === order._id)
        return {
          collect_id: order._id,
          school_id: order.school_id,
          gateway: order.gateway_name,
          order_amount: order.order_amount,
          transaction_amount: status?.transaction_amount || order.order_amount,
          status: status?.status || "pending",
          custom_order_id: order.custom_order_id,
          student_info: order.student_info,
          payment_mode: status?.payment_mode || "NA",
          payment_time: status?.payment_time,
          createdAt: order.createdAt,
        }
      }).filter(transaction => {
        if (status && status !== "all" && transaction.status !== status) return false
        if (start_date && end_date) {
          const transDate = new Date(transaction.createdAt)
          const start = new Date(start_date)
          const end = new Date(end_date)
          if (transDate < start || transDate > end) return false
        }
        return true
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    if (format === 'csv') {
      // Convert to CSV
      const csvHeader = "Sr.No,Institute Name,Date & Time,Order ID,Edviron Order ID,Order Amt,Transaction Amt,Payment Method,Status,Student Name,Student ID,Phone No.,Vendor Amount,Gateway,Capture Status\n"
      
      const csvRows = transactions.map((transaction, index) => {
        const date = new Date(transaction.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
        
        return [
          index + 1,
          `"${transaction.school_id || 'EDV DEMO SCHOOL'}"`,
          `"${date}"`,
          '"N/A"',
          `"${transaction.custom_order_id}"`,
          `"₹${transaction.order_amount.toLocaleString()}"`,
          `"₹${transaction.transaction_amount.toLocaleString()}"`,
          `"${transaction.payment_mode || 'NA'}"`,
          `"${transaction.status}"`,
          `"${transaction.student_info.name}"`,
          `"${transaction.student_info.id}"`,
          `"${transaction.student_info.email || '0000000000'}"`,
          '"NA"',
          `"${transaction.gateway || 'NA'}"`,
          '"NA"'
        ].join(',')
      }).join('\n')

      const csvContent = csvHeader + csvRows

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"')
      res.send(csvContent)
    } else {
      res.json({
        success: true,
        data: transactions,
        count: transactions.length
      })
    }
  } catch (error) {
    console.error("Export error:", error)
    res.status(500).json({
      success: false,
      message: "Export failed",
      error: error.message
    })
  }
})

module.exports = router


