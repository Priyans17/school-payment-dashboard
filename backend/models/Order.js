const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    school_id: {
      type: String,
      required: true,
    },
    trustee_id: {
      type: String,
      required: true,
    },
    student_info: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    gateway_name: {
      type: String,
      required: true,
    },
    custom_order_id: {
      type: String,
      unique: true,
      required: true,
    },
    order_amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Order", orderSchema)
