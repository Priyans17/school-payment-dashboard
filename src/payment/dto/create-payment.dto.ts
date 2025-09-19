import { IsString, IsNumber, IsOptional, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class StudentInfoDto {
  @IsString()
  name: string

  @IsString()
  id: string

  @IsString()
  email: string
}

export class CreatePaymentDto {
  @IsNumber()
  amount: number

  @ValidateNested()
  @Type(() => StudentInfoDto)
  student_info: StudentInfoDto

  @IsOptional()
  @IsString()
  callback_url?: string
}
