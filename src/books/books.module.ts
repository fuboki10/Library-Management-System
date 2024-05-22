import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, PrismaService, TransactionsService, UsersService],
})
export class BooksModule {}
