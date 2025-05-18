import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ILoginAuthDto } from "src/shared/interfaces/auth/request/ILoginAuthDto";

export class LoginAuthDto implements ILoginAuthDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'admin@mail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
