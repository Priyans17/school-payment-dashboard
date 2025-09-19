const mongoose = require("mongoose")
const memoryStorage = require("../memory-storage")

// Check if mongoose is connected
const isConnected = mongoose.connection.readyState === 1

let OrderStatus

if (isConnected) {
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

  OrderStatus = mongoose.model("OrderStatus", orderStatusSchema)
} else {
  // Fallback to memory storage
  OrderStatus = class {
    constructor(statusData) {
      Object.assign(this, statusData)
    }

    async save() {
      return memoryStorage.createOrderStatus(this)
    }

    static async findOne(query) {
      return memoryStorage.findOrderStatus(query)
    }

    static async find(query = {}) {
      return memoryStorage.findOrderStatuses(query)
    }

    static async updateOne(query, updateData) {
      return memoryStorage.updateOrderStatus(query, updateData)
    }
  }
}

module.exports = OrderStatus
