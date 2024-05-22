import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class QueryFailedExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(QueryFailedExceptionFilter.name);

  public catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = {
      status: HttpStatus.BAD_REQUEST,
      message: 'Input data validation failed',
      errors: this.buildError(exception),
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }

  private buildError(exception: Prisma.PrismaClientKnownRequestError): any {
    const { meta }: any = exception;
    const key = meta.target[0];
    const errors = [];
    if (exception.code === 'P2002') {
      // Unique constraint
      errors.push(`${key} must be unique`);
    } else {
      this.logger.error(exception.message);

      errors.push(`${key} Unknown error: ${exception.message}`);
    }

    return errors;
  }
}
