import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";
import { IsString } from "class-validator";
import { IsOptional } from "class-validator";
import { IsEmail } from "class-validator";
import { ICreateComplaintReq } from "~/shared/interfaces/complaints/request/IComplaintReq.dto";

export class CreateComplaintDto implements ICreateComplaintReq {
  @IsEmail({}, {
    message: 'Imeyili ntiyanditse neza',
  })
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  @IsOptional({
    message: 'Andika imeyili yawe',
  })
  email?: string;

  @IsString()
  @IsNotEmpty({
    message: 'Andika amazina yawe',
  })
  @ApiProperty({
    description: 'The names of the user',
    example: 'John Doe',
  })
  names: string;

  @IsString()
  @IsNotEmpty({
    message: 'Andika inyito y\'ikibazo',
  })
  @ApiProperty({
    description: 'The title of the complaint',
    example: 'Water Leak',
  })
  title: string;

  @IsPhoneNumber('RW')
  @IsNotEmpty({
    message: 'Andika nimero ya telefoni yawe',
  })
  @ApiProperty({
    description: 'The telephone of the user',
    example: '+250788123456',
  })
  telephone: string;

  @IsString()
  @IsNotEmpty({
    message: 'Andika ibisobanuro by\'ikibazo',
  })
  @ApiProperty({
    description: 'The description of the complaint',
    example: 'There has been a water leak on Kicukiro Avenue for the past 3 days. The street is flooded and water is being wasted.',
  })
  description: string;

  // @IsNumber()
  // @ApiProperty({
  //   description: 'The id of the agency',
  //   example: 1,
  // })
  // @IsOptional()
  // agencyId?: number;

  @IsNumber()
  @IsNotEmpty({
    message: 'Hitamo ikiciro cy\'ikibazo',
  })
  @ApiProperty({
    description: 'The id of the category',
    example: 1,
  })
  categoryId: number;
}
