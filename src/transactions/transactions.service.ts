import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateBorrowTransactionDto } from './dto/borrow-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}

  borrow(
    bookId: number,
    userId: number,
    borrowTransactionDto: CreateBorrowTransactionDto,
  ) {
    return this.prismaService.$transaction(async (trnsClient) => {
      // check if the book is available
      await this.booksService.isAvailable(bookId, trnsClient as any);
      // check is the user exists
      await this.usersService.isAvailable(userId, trnsClient as any);
      // check if the user has borrowed the book
      await this.isAvailableToBorrow(bookId, userId, trnsClient as any);
      // decrease book quantity by one
      await this.booksService.decreaseQuantityByOne(bookId, trnsClient as any);
      // create a borrow transaction
      return await trnsClient.borrowingTransaction.create({
        data: {
          ...borrowTransactionDto,
          bookId,
          userId,
        },
      });
    });
  }

  async isAvailableToBorrow(
    bookId: number,
    userId: number,
    prisma: PrismaClient,
  ) {
    const existingTransaction = await prisma.borrowingTransaction.findFirst({
      where: {
        bookId,
        userId,
        returnedAt: null,
      },
    });
    // if yes, throw an error
    if (existingTransaction) {
      throw new BadRequestException(
        `User with ID = ${userId} has already borrowed the book with ID = ${bookId}`,
      );
    }

    return true;
  }
}
