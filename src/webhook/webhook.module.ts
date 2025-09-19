import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { WebhookService } from "./webhook.service"
import { WebhookController } from "./webhook.controller"
import { WebhookLog, WebhookLogSchema } from "../schemas/webhook-log.schema"
import { OrderStatus, OrderStatusSchema } from "../schemas/order-status.schema"
import { Order, OrderSchema } from "../schemas/order.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebhookLog.name, schema: WebhookLogSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
