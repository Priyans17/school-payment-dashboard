const express = require("express")
const Order = require("../models/Order")
const OrderStatus = require("../models/OrderStatus")
const WebhookLog = require("../models/WebhookLog")

const router = express.Router()

// Webhook endpoint
router.post("/", async (req, res) => {
  try {
    const webhookPayload = req.body

    // Log the webhook
    const webhookLog = new WebhookLog({
      order_id: webhookPayload.order_info?.order_id || "unknown",
      payload: webhookPayload,
      status: webhookPayload.status || 200,
    })

    await webhookLog.save()

    // Process webhook if it has order info
    if (webhookPayload.order_info && webhookPayload.order_info.order_id) {
      const { order_info } = webhookPayload

      // Find the order by custom_order_id
      const order = await Order.findOne({ custom_order_id: order_info.order_id })

      if (order) {
        // Update order status
        await OrderStatus.findOneAndUpdate(
          { collect_id: order._id },
          {
            order_amount: order_info.order_amount || order.order_amount,
            transaction_amount: order_info.transaction_amount || order_info.order_amount,
            payment_mode: order_info.payment_mode || "NA",
            payment_details: order_info.payemnt_details || "NA", // Note: API has typo
            bank_reference: order_info.bank_reference || "NA",
            payment_message: order_info.Payment_message || "NA",
            status: order_info.status || "pending",
            error_message: order_info.error_message || "NA",
            payment_time: order_info.payment_time ? new Date(order_info.payment_time) : new Date(),
          },
          { upsert: true, new: true },
        )

        // Mark webhook as processed
        webhookLog.processed = true
        await webhookLog.save()

        console.log(`✅ Webhook processed for order: ${order_info.order_id}`)
      } else {
        console.log(`⚠️ Order not found for webhook: ${order_info.order_id}`)
        webhookLog.error_message = "Order not found"
        await webhookLog.save()
      }
    }

    res.status(200).json({
      success: true,
      message: "Webhook received and processed",
    })
  } catch (error) {
    console.error("Webhook processing error:", error)

    // Try to update webhook log with error
    try {
      if (req.body.order_info?.order_id) {
        await WebhookLog.findOneAndUpdate(
          { order_id: req.body.order_info.order_id },
          { error_message: error.message },
          { sort: { createdAt: -1 } },
        )
      }
    } catch (logError) {
      console.error("Failed to log webhook error:", logError)
    }

    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    })
  }
})

module.exports = router
