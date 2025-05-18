import { IGetCategoryResDto } from "../../categories/response/ICategoryRes.dto";
import { IGetAgencyResDto } from "../../agencies/response/IAgencyRes.dto";
import { EComplaintStatus } from "../../../enums/EComplainStatus.enum";

export interface IGetComplaintResDto {
  id?: number;
  trackingCode: string;
  names: string;
  title: string;
  telephone: string;
  email: string;
  description: string;
  status: EComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
  category?: IGetCategoryResDto;
  agency?: IGetAgencyResDto;
  response?: IGetResponseResDto;
}

export interface IGetResponseResDto {
  id: number;
  response: string;
  createdAt: Date;
}
