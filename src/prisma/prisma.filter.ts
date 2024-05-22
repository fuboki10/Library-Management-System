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
    try {
      const errorResponse = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Input data validation failed',
        errors: this.buildError(exception),
      };

      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }

  private buildError(exception: Prisma.PrismaClientKnownRequestError): any {
    const { meta }: any = exception;
    const errors = [];
    if (exception.code === 'P2002') {
      const key = meta.target[0];
      // Unique constraint
      errors.push(`${key} must be unique`);
    } else {
      this.logger.debug(exception);
      this.logger.error(exception.message);

      throw new Error(exception.message);
    }

    return errors;
  }
}
