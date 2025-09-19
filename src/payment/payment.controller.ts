import { Controller, Post, Get, Param, UseGuards } from "@nestjs/common"
import type { PaymentService } from "./payment.service"
import type { CreatePaymentDto } from "./dto/create-payment.dto"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("payment")
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("create-payment")
  async createPayment(createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto)
  }

  @Get('status/:collectRequestId')
  async checkPaymentStatus(@Param('collectRequestId') collectRequestId: string) {
    return this.paymentService.checkPaymentStatus(collectRequestId);
  }
}
