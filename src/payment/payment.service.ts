import { Injectable, BadRequestException } from "@nestjs/common"
import type { Model } from "mongoose"
import * as jwt from "jsonwebtoken"
import axios from "axios"
import type { OrderDocument } from "../schemas/order.schema"
import type { OrderStatusDocument } from "../schemas/order-status.schema"
import type { CreatePaymentDto } from "./dto/create-payment.dto"

@Injectable()
export class PaymentService {
  private orderModel: Model<OrderDocument>
  private orderStatusModel: Model<OrderStatusDocument>

  constructor(orderModel: Model<OrderDocument>, orderStatusModel: Model<OrderStatusDocument>) {
    this.orderModel = orderModel
    this.orderStatusModel = orderStatusModel
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { amount, student_info, callback_url } = createPaymentDto

    // Generate custom order ID
    const custom_order_id = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create order in database
    const order = new this.orderModel({
      school_id: process.env.SCHOOL_ID,
      trustee_id: process.env.SCHOOL_ID, // Using school_id as trustee_id for simplicity
      student_info,
      gateway_name: "Edviron",
      custom_order_id,
      amount: Number.parseFloat(amount),
      status: "pending",
    })

    const savedOrder = await order.save()

    // Create JWT signature for payment API
    const signPayload = {
      school_id: process.env.SCHOOL_ID,
      amount: amount.toString(),
      callback_url: callback_url || `${process.env.FRONTEND_URL}/payment-success`,
    }

    const sign = jwt.sign(signPayload, process.env.PG_KEY)

    // Prepare payment API request
    const paymentData = {
      school_id: process.env.SCHOOL_ID,
      amount: amount.toString(),
      callback_url: callback_url || `${process.env.FRONTEND_URL}/payment-success`,
      sign,
    }

    try {
      // Call Edviron payment API
      const response = await axios.post(`${process.env.PAYMENT_API_URL}/create-collect-request`, paymentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
        },
      })

      // Create initial order status
      const orderStatus = new this.orderStatusModel({
        collect_id: savedOrder._id,
        order_amount: Number.parseFloat(amount),
        transaction_amount: Number.parseFloat(amount),
        payment_mode: "pending",
        payment_details: "Payment initiated",
        bank_reference: "N/A",
        payment_message: "Payment request created",
        status: "pending",
        error_message: "N/A",
        payment_time: new Date(),
        gateway: "Edviron",
      })

      await orderStatus.save()

      return {
        success: true,
        order_id: savedOrder._id,
        custom_order_id,
        collect_request_id: response.data.collect_request_id,
        payment_url: response.data.Collect_request_url,
        message: "Payment request created successfully",
      }
    } catch (error) {
      console.error("Payment API Error:", error.response?.data || error.message)

      // Update order status to failed
      await this.orderModel.findByIdAndUpdate(savedOrder._id, { status: "failed" })

      throw new BadRequestException({
        success: false,
        message: "Failed to create payment request",
        error: error.response?.data || error.message,
      })
    }
  }

  async checkPaymentStatus(collectRequestId: string) {
    try {
      // Create JWT signature for status check
      const signPayload = {
        school_id: process.env.SCHOOL_ID,
        collect_request_id: collectRequestId,
      }

      const sign = jwt.sign(signPayload, process.env.PG_KEY)

      // Call payment status API
      const response = await axios.get(`${process.env.PAYMENT_API_URL}/collect-request/${collectRequestId}`, {
        params: {
          school_id: process.env.SCHOOL_ID,
          sign,
        },
        headers: {
          Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
        },
      })

      return {
        success: true,
        status: response.data.status,
        amount: response.data.amount,
        details: response.data.details,
      }
    } catch (error) {
      console.error("Payment Status Check Error:", error.response?.data || error.message)

      throw new BadRequestException({
        success: false,
        message: "Failed to check payment status",
        error: error.response?.data || error.message,
      })
    }
  }
}
