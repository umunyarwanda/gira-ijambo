import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateComplaintDto } from './create-complaint.dto';
import { IUpdateComplaintReq } from '~/shared/interfaces/complaints/request/IComplaintReq.dto';
import { EComplaintStatus } from '~/shared/enums/EComplainStatus.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { IsOptional } from 'class-validator';

export class UpdateComplaintDto extends CreateComplaintDto implements IUpdateComplaintReq {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The response text of the complaint',
    example: 'The complaint has been resolved',
  })
  responseText: string;

  @IsEnum(EComplaintStatus)
  @IsOptional()
  @ApiProperty({
    description: 'The status of the complaint',
    example: EComplaintStatus.PENDING,
  })
  status: EComplaintStatus;

  // @IsEnum(EComplaintStatus)
  // @ApiProperty({
  //   description: 'The status of the complaint',
  //   example: EComplaintStatus.PENDING,
  // })
  // status: EComplaintStatus;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({
  //   description: 'The title of the complaint',
  //   example: 'Water Leak',
  // })
  // title: string;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({
  //   description: 'The names of the user',
  //   example: 'John Doe',
  // })
  // names: string;

  // @IsPhoneNumber('RW')
  // @IsNotEmpty()
  // @ApiProperty({
  //   description: 'The telephone of the user',
  //   example: '+250788123456',
  // })
  // telephone: string;

  // @IsNumber()
  // @ApiProperty({
  //   description: 'The id of the agency',
  //   example: 1,
  // })
  // @IsOptional()
  // agencyId?: number;

  // @IsString()
  // @ApiProperty({
  //   description: 'The description of the complaint',
  //   example: 'There has been a water leak on Kicukiro Avenue for the past 3 days. The street is flooded and water is being wasted.',
  // })
  // @IsOptional()
  // description?: string;

  // @IsNumber()
  // @ApiProperty({
  //   description: 'The id of the category',
  //   example: 1,
  // })
  // @IsOptional()
  // categoryId?: number;
}
