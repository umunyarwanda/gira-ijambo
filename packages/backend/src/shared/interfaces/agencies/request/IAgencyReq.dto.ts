export interface ICreateAgencyReqDto {
  name: string;
  description?: string;
  email?: string;
  categoryId: number;
}

export interface IUpdateAgencyReqDto {
  name?: string;
  description?: string;
  email?: string;
  categoryId: number;
}
