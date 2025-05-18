import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { IResetPasswordDto } from "~/shared/interfaces/auth/request/IResetPasswordDto";

export class ResetPasswordDto implements IResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@example.com'
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The OTP of the user',
    example: '123456'
  })
  @ValidateIf((object, value) => value !== undefined)
  otp?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'The new password',
    example: 'password'
  })
  @ValidateIf((object, value) => value !== undefined)
  newPassword?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The confirm password of the user',
    example: 'password'
  })
  @ValidateIf((object, value) => value !== undefined)
  confirmPassword?: string;
}
