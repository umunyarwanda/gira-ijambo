import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ICreateCategoryReqDto } from "~/shared/interfaces/categories/request/ICategoryReq.dto";

export class CreateCategoryDto implements ICreateCategoryReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ 
    description: 'The name of the category',
    example: 'Category Name',
  })
  name: string;
}
