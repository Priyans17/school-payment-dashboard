import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { Model } from "mongoose"
import type { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import type { UserDocument } from "../schemas/user.schema"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
  private userModel: Model<UserDocument>
  private jwtService: JwtService

  constructor(userModel: Model<UserDocument>, jwtService: JwtService) {
    this.userModel = userModel
    this.jwtService = jwtService
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      throw new UnauthorizedException("User already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
    })

    await user.save()

    // Generate JWT token
    const payload = { email: user.email, sub: user._id, name: user.name }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // Find user
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user._id, name: user.name }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }
}
