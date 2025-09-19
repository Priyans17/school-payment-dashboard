import { Controller, Post, HttpCode, HttpStatus } from "@nestjs/common"
import type { Request } from "express"
import type { WebhookService } from "./webhook.service"
import type { WebhookPayloadDto } from "./dto/webhook-payload.dto"

@Controller("webhook")
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(payload: WebhookPayloadDto, req: Request) {
    const sourceIp = req.ip || req.connection.remoteAddress || "unknown"
    return this.webhookService.processWebhook(payload, sourceIp)
  }
}
