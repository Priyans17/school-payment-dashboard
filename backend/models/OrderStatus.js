const mongoose = require("mongoose")

const orderStatusSchema = new mongoose.Schema(
  {
    collect_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    order_amount: {
      type: Number,
      required: true,
    },
    transaction_amount: {
      type: Number,
      required: true,
    },
    payment_mode: {
      type: String,
      default: "NA",
    },
    payment_details: {
      type: String,
      default: "NA",
    },
    bank_reference: {
      type: String,
      default: "NA",
    },
    payment_message: {
      type: String,
      default: "NA",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    error_message: {
      type: String,
      default: "NA",
    },
    payment_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("OrderStatus", orderStatusSchema)
