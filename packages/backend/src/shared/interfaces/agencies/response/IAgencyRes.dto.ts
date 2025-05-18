import { IGetCategoryResDto } from "../../categories/response/ICategoryRes.dto";

export interface IGetAgencyResDto {
  id: number;
  name: string;
  description?: string;
  email?: string;
  category?: IGetCategoryResDto;
  createdAt: Date;
}

