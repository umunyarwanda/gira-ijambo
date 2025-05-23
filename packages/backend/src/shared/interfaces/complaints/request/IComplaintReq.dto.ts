import { EComplaintStatus } from "../../../enums/EComplainStatus.enum";

export interface ICreateComplaintReq {
  names: string;
  title: string;
  telephone: string;
  email?: string | null;
  description: string;
  categoryId: number | null;
}

export interface IUpdateComplaintReq extends ICreateComplaintReq {
  responseText: string;
  status: EComplaintStatus;
}

export interface IResponseComplaintReq {
  complaintId: number;
  complaintStatus: EComplaintStatus;
  response: string;
}

