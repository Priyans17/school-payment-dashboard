import { Injectable } from "@nestjs/common"
import type { Model } from "mongoose"
import type { OrderDocument } from "../schemas/order.schema"
import type { OrderStatusDocument } from "../schemas/order-status.schema"

@Injectable()
export class TransactionService {
  constructor(
    private orderModel: Model<OrderDocument>,
    private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getAllTransactions(page = 1, limit = 10, sort = "createdAt", order = "desc") {
    const skip = (page - 1) * limit
    const sortOrder = order === "desc" ? -1 : 1

    const pipeline = [
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status_info",
        },
      },
      {
        $unwind: {
          path: "$status_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          collect_id: "$_id",
          school_id: "$school_id",
          gateway: "$gateway_name",
          order_amount: "$amount",
          transaction_amount: "$status_info.transaction_amount",
          status: "$status",
          custom_order_id: "$custom_order_id",
          student_name: "$student_info.name",
          student_id: "$student_info.id",
          student_email: "$student_info.email",
          payment_mode: "$status_info.payment_mode",
          payment_time: "$status_info.payment_time",
          bank_reference: "$status_info.bank_reference",
          payment_message: "$status_info.payment_message",
          createdAt: "$createdAt",
        },
      },
      {
        $sort: { [sort]: sortOrder },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]

    const transactions = await this.orderModel.aggregate(pipeline)
    const total = await this.orderModel.countDocuments()

    return {
      transactions,
      pagination: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    }
  }

  async getTransactionsBySchool(schoolId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const pipeline = [
      {
        $match: { school_id: schoolId },
      },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status_info",
        },
      },
      {
        $unwind: {
          path: "$status_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          collect_id: "$_id",
          school_id: "$school_id",
          gateway: "$gateway_name",
          order_amount: "$amount",
          transaction_amount: "$status_info.transaction_amount",
          status: "$status",
          custom_order_id: "$custom_order_id",
          student_name: "$student_info.name",
          student_id: "$student_info.id",
          payment_mode: "$status_info.payment_mode",
          payment_time: "$status_info.payment_time",
          createdAt: "$createdAt",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]

    const transactions = await this.orderModel.aggregate(pipeline)
    const total = await this.orderModel.countDocuments({ school_id: schoolId })

    return {
      transactions,
      pagination: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    }
  }

  async getTransactionStatus(customOrderId: string) {
    const pipeline = [
      {
        $match: { custom_order_id: customOrderId },
      },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status_info",
        },
      },
      {
        $unwind: {
          path: "$status_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          collect_id: "$_id",
          custom_order_id: "$custom_order_id",
          status: "$status",
          order_amount: "$amount",
          transaction_amount: "$status_info.transaction_amount",
          payment_mode: "$status_info.payment_mode",
          payment_time: "$status_info.payment_time",
          payment_message: "$status_info.payment_message",
          gateway: "$gateway_name",
          student_info: "$student_info",
        },
      },
    ]

    const result = await this.orderModel.aggregate(pipeline)

    if (result.length === 0) {
      return null
    }

    return result[0]
  }
}
