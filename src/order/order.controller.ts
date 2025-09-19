import { Controller, Post, UseGuards } from "@nestjs/common"
import type { OrderService } from "./order.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("order")
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post("create-dummy-data")
  async createDummyData() {
    return this.orderService.createDummyData()
  }
}
