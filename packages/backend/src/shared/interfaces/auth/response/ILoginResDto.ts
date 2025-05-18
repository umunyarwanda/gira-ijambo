import { EUserRole } from "../../../enums/EUserRole.enum";

export interface ILoginResDto {
  accessToken: string;
}

export interface IAuthTokenData {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  role: EUserRole;
  isActive: boolean;
  phone: string;
}