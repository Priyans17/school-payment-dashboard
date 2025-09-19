import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TransactionService } from "./transaction.service"
import { TransactionController } from "./transaction.controller"
import { Order, OrderSchema } from "../schemas/order.schema"
import { OrderStatus, OrderStatusSchema } from "../schemas/order-status.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
    ]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
