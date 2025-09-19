import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { OrderService } from "./order.service"
import { OrderController } from "./order.controller"
import { Order, OrderSchema } from "../schemas/order.schema"
import { OrderStatus, OrderStatusSchema } from "../schemas/order-status.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
