import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IUpdateUserReqDto } from '~/shared/interfaces/users/request/IUserReqDto';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MinLength, ValidateIf } from 'class-validator';
import { EUserRole } from '~/shared/enums/EUserRole.enum';

export class UpdateUserDto implements IUpdateUserReqDto {
  @IsString()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John'
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe'
  })
  lastName: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com'
  })
  email: string;

  @IsPhoneNumber('RW')
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+250788123456'
  })
  phone: string;
  
  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== null && value !== '')
  @MinLength(3)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password'
  })
  password: string;


  @IsEnum(EUserRole)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The role of the user',
    example: EUserRole.SUPER_ADMIN
  })
  role: EUserRole;

  @ApiProperty({
    description: 'The active status of the user',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  @ValidateIf((object, value) => value !== null && value !== '')
  isActive: boolean;
}
