import { Controller, Get, Param, UseGuards, NotFoundException } from "@nestjs/common"
import type { TransactionService } from "./transaction.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(page = "1", limit = "10", sort = "createdAt", order = "desc") {
    return this.transactionService.getAllTransactions(Number.parseInt(page), Number.parseInt(limit), sort, order)
  }

  @Get("school/:schoolId")
  async getTransactionsBySchool(@Param('schoolId') schoolId: string, page = "1", limit = "10") {
    return this.transactionService.getTransactionsBySchool(schoolId, Number.parseInt(page), Number.parseInt(limit))
  }
}

@Controller("transaction-status")
@UseGuards(JwtAuthGuard)
export class TransactionStatusController {
  constructor(private transactionService: TransactionService) {}

  @Get(':customOrderId')
  async getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    const transaction = await this.transactionService.getTransactionStatus(customOrderId);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return {
      success: true,
      transaction,
    };
  }
}
