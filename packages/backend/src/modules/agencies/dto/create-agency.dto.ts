import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ICreateAgencyReqDto } from "~/shared/interfaces/agencies/request/IAgencyReq.dto";

export class CreateAgencyDto implements ICreateAgencyReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the agency',
    example: 'Agency Name',
  })
  name: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the agency',
    example: 'agency@example.com',
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The description of the agency',
    example: 'Agency Description',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The category ID of the agency',
    example: 1,
  })
  categoryId: number;
}
