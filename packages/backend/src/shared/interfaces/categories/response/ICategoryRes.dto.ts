import { IGetAgencyResDto } from "../../agencies/response/IAgencyRes.dto";

export interface IGetCategoryResDto {
  id: number;
  name: string;
  createdAt?: Date;
  agency?: IGetAgencyResDto;
}

export interface IGetCategoryResDtoWithcomplainCount extends IGetCategoryResDto {
  complainCount: number;
}
