import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { EComplaintStatus } from "~/shared/enums/EComplainStatus.enum";
import { IResponseComplaintReq } from "~/shared/interfaces/complaints/request/IComplaintReq.dto";

export class ResponseComplaintDto implements IResponseComplaintReq {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The ID of the complaint', example: 1 })
  complaintId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'The status of the complaint', example: EComplaintStatus.PENDING }) 
  @IsEnum(EComplaintStatus)
  complaintStatus: EComplaintStatus;

  @IsNotEmpty()
  @ApiProperty({ description: 'The response to the complaint', example: 'The complaint has been resolved' })
  @IsString()
  response: string;
}