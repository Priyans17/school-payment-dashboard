import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type OrderStatusDocument = OrderStatus & Document

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ type: Types.ObjectId, ref: "Order", required: true })
  collect_id: Types.ObjectId

  @Prop({ required: true })
  order_amount: number

  @Prop({ required: true })
  transaction_amount: number

  @Prop({ required: true })
  payment_mode: string

  @Prop({ required: true })
  payment_details: string

  @Prop({ required: true })
  bank_reference: string

  @Prop({ required: true })
  payment_message: string

  @Prop({ required: true })
  status: string

  @Prop({ default: "NA" })
  error_message: string

  @Prop({ required: true })
  payment_time: Date

  @Prop({ required: true })
  gateway: string
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus)
