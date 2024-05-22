import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, BooksService, UsersService],
})
export class TransactionsModule {}
