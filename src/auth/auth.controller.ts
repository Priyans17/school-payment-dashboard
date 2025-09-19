import { Controller, Post, UseGuards, Request } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { CreateUserDto } from "./dto/create-user.dto"
import { LocalAuthGuard } from "./local-auth.guard"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
