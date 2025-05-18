import { EUserRole } from "../../../../shared/enums/EUserRole.enum";

export interface IGetUserResDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  role: EUserRole;
  isActive: boolean;
  phone: string;
  createdAt?: Date;
}
