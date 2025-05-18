import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MinLength, ValidateIf } from "class-validator";
import { EUserRole } from "~/shared/enums/EUserRole.enum";
import { ICreateUserReqDto } from "~/shared/interfaces/users/request/IUserReqDto";

export class CreateUserDto implements ICreateUserReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John'
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe'
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com'
  })
  email: string;

  @IsString()
  @IsPhoneNumber('RW')
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+250788123456'
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password'
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The confirm password of the user',
    example: 'password'
  })
  confirmPassword: string;

  @IsEnum(EUserRole)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The role of the user',
    example: EUserRole.SUPER_ADMIN
  })
  role: EUserRole;

}
