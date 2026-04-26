import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ApiResponseDto } from '@shared/application/dto/api-response.dto';
import { APP_MESSAGES } from '@shared/constants/app-messages.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const path = request.url;
    const timestamp = new Date().toISOString();

    if (exception instanceof PrismaClientKnownRequestError) {
      this.logger.error(`${exception.code}: ${exception.message}`);
      if (exception.code === 'P2021') {
        const responseBody: ApiResponseDto<null> = {
          success: false,
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: APP_MESSAGES.DB_SCHEMA_OUTDATED,
          timestamp,
          path,
        };
        response.status(HttpStatus.SERVICE_UNAVAILABLE).json(responseBody);
        return;
      }
    }

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[] = APP_MESSAGES.INTERNAL_ERROR;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      message =
        (exceptionResponse as { message?: string | string[] }).message ??
        message;
    }

    const responseBody: ApiResponseDto<null> = {
      success: false,
      statusCode: status,
      message,
      timestamp,
      path,
    };

    response.status(status).json(responseBody);
  }
}
