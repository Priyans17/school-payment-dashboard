import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type OrderDocument = Order & Document

@Schema({ _id: false })
export class StudentInfo {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  id: string

  @Prop({ required: true })
  email: string
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, required: true })
  school_id: Types.ObjectId

  @Prop({ type: Types.ObjectId, required: true })
  trustee_id: Types.ObjectId

  @Prop({ type: StudentInfo, required: true })
  student_info: StudentInfo

  @Prop({ required: true })
  gateway_name: string

  @Prop({ required: true })
  custom_order_id: string

  @Prop({ required: true })
  amount: number

  @Prop({ default: "pending" })
  status: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
