import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type WebhookLogDocument = WebhookLog & Document

@Schema({ timestamps: true })
export class WebhookLog {
  @Prop({ required: true })
  event_type: string

  @Prop({ type: Object, required: true })
  payload: any

  @Prop({ required: true })
  status_code: number

  @Prop({ required: true })
  order_id: string

  @Prop({ default: "received" })
  processing_status: string

  @Prop()
  error_message: string

  @Prop({ required: true })
  source_ip: string
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog)
