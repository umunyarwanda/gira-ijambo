export class CommonDtoResp {
  status: string | number;
  message: string;
  data?: any;

  constructor(status: string | number, message: string, data?: any) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
