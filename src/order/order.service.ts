import { Injectable } from "@nestjs/common"
import type { Model } from "mongoose"
import type { OrderDocument } from "../schemas/order.schema"
import type { OrderStatusDocument } from "../schemas/order-status.schema"

@Injectable()
export class OrderService {
  constructor(
    private orderModel: Model<OrderDocument>,
    private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async findOrderByCustomId(customOrderId: string) {
    return this.orderModel.findOne({ custom_order_id: customOrderId })
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
  }

  async createDummyData() {
    // Create dummy orders
    const dummyOrders = [
      {
        school_id: process.env.SCHOOL_ID,
        trustee_id: process.env.SCHOOL_ID,
        student_info: {
          name: "John Doe",
          id: "STU001",
          email: "john.doe@example.com",
        },
        gateway_name: "PhonePe",
        custom_order_id: "ORD_1234567890_abc123",
        amount: 1000,
        status: "success",
      },
      {
        school_id: process.env.SCHOOL_ID,
        trustee_id: process.env.SCHOOL_ID,
        student_info: {
          name: "Jane Smith",
          id: "STU002",
          email: "jane.smith@example.com",
        },
        gateway_name: "Paytm",
        custom_order_id: "ORD_1234567891_def456",
        amount: 1500,
        status: "pending",
      },
      {
        school_id: process.env.SCHOOL_ID,
        trustee_id: process.env.SCHOOL_ID,
        student_info: {
          name: "Mike Johnson",
          id: "STU003",
          email: "mike.johnson@example.com",
        },
        gateway_name: "Razorpay",
        custom_order_id: "ORD_1234567892_ghi789",
        amount: 2000,
        status: "failed",
      },
    ]

    const orders = await this.orderModel.insertMany(dummyOrders)

    // Create dummy order statuses
    const dummyOrderStatuses = orders.map((order, index) => ({
      collect_id: order._id,
      order_amount: order.amount,
      transaction_amount: order.amount + index * 50, // Add some variation
      payment_mode: ["upi", "card", "netbanking"][index],
      payment_details: [`success@ybl`, `****1234`, `HDFC Bank`][index],
      bank_reference: [`YESBNK${100 + index}`, `ICICI${200 + index}`, `HDFC${300 + index}`][index],
      payment_message: ["Payment successful", "Payment pending", "Payment failed"][index],
      status: ["success", "pending", "failed"][index],
      error_message: index === 2 ? "Insufficient funds" : "N/A",
      payment_time: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // Different dates
      gateway: order.gateway_name,
    }))

    await this.orderStatusModel.insertMany(dummyOrderStatuses)

    return {
      message: "Dummy data created successfully",
      orders: orders.length,
      orderStatuses: dummyOrderStatuses.length,
    }
  }
}
