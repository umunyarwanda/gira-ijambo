import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

export class Exception extends HttpException {
  constructor(
    message: string,
    code: string,
    statusCode: HttpStatus,
    details?: any,
  ) {
    super(
      {
        message: message,
        status: code,
        details: details,
      },
      statusCode,
    );
  }
}
