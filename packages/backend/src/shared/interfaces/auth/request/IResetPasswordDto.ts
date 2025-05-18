export interface IResetPasswordDto {
  email: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}