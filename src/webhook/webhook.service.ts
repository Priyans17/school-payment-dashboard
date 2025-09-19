import { Injectable, Logger } from "@nestjs/common"
import type { Model } from "mongoose"
import type { WebhookLogDocument } from "../schemas/webhook-log.schema"
import type { OrderStatusDocument } from "../schemas/order-status.schema"
import type { OrderDocument } from "../schemas/order.schema"
import type { WebhookPayloadDto } from "./dto/webhook-payload.dto"

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)

  constructor(
    private webhookLogModel: Model<WebhookLogDocument>,
    private orderStatusModel: Model<OrderStatusDocument>,
    private orderModel: Model<OrderDocument>,
  ) {}

  async processWebhook(payload: WebhookPayloadDto, sourceIp: string) {
    this.logger.log(`Processing webhook for order: ${payload.order_info.order_id}`)

    try {
      // Log the webhook
      const webhookLog = new this.webhookLogModel({
        event_type: "payment_update",
        payload,
        status_code: payload.status,
        order_id: payload.order_info.order_id,
        processing_status: "processing",
        source_ip: sourceIp,
      })

      await webhookLog.save()

      // Find the order by collect_id (order_id from webhook)
      const order = await this.orderModel.findById(payload.order_info.order_id)

      if (!order) {
        this.logger.error(`Order not found: ${payload.order_info.order_id}`)
        await this.webhookLogModel.findByIdAndUpdate(webhookLog._id, {
          processing_status: "failed",
          error_message: "Order not found",
        })
        return { success: false, message: "Order not found" }
      }

      // Update or create order status
      const orderStatusUpdate = {
        collect_id: order._id,
        order_amount: payload.order_info.order_amount,
        transaction_amount: payload.order_info.transaction_amount,
        payment_mode: payload.order_info.payment_mode,
        payment_details: payload.order_info.payemnt_details, // Note: typo in original spec
        bank_reference: payload.order_info.bank_reference,
        payment_message: payload.order_info.Payment_message,
        status: payload.order_info.status,
        error_message: payload.order_info.error_message || "N/A",
        payment_time: new Date(payload.order_info.payment_time),
        gateway: payload.order_info.gateway,
      }

      // Update or create order status
      await this.orderStatusModel.findOneAndUpdate({ collect_id: order._id }, orderStatusUpdate, {
        upsert: true,
        new: true,
      })

      // Update order status
      await this.orderModel.findByIdAndUpdate(order._id, {
        status: payload.order_info.status,
      })

      // Mark webhook as processed
      await this.webhookLogModel.findByIdAndUpdate(webhookLog._id, {
        processing_status: "completed",
      })

      this.logger.log(`Webhook processed successfully for order: ${payload.order_info.order_id}`)

      return {
        success: true,
        message: "Webhook processed successfully",
        order_id: payload.order_info.order_id,
      }
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`)

      return {
        success: false,
        message: "Webhook processing failed",
        error: error.message,
      }
    }
  }
}
