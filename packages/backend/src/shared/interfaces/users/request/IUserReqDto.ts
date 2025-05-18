import { EUserRole } from "../../../../shared/enums/EUserRole.enum";

export interface ICreateUserReqDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: EUserRole;
  phone: string;
}

export interface IUpdateUserReqDto extends Omit<ICreateUserReqDto, 'confirmPassword'> {
  isActive?: boolean;
}

