import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PaymentService } from "./payment.service"
import { PaymentController } from "./payment.controller"
import { Order, OrderSchema } from "../schemas/order.schema"
import { OrderStatus, OrderStatusSchema } from "../schemas/order-status.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
    ]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
