import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateBorrowTransactionDto } from './dto/borrow-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { PrismaClient } from '@prisma/client';
import { IRangedDate } from '../utils/dtos';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Retrieves all borrowing transactions within the specified date range.
   * If no date range is provided, returns all borrowing transactions.
   *
   * @param rangeDate - An optional object specifying the date range.
   * @returns A promise that resolves to an array of borrowing transactions.
   */
  findAll(rangeDate?: IRangedDate) {
    return this.prismaService.borrowingTransaction.findMany({
      where: {
        borrowedAt: {
          gte: rangeDate?.from,
          lte: rangeDate?.to,
        },
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.borrowingTransaction.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Finds the borrowed books within a specified date range.
   * If no date range is provided, it returns all the currently borrowed books.
   *
   * @param rangeDate - Optional date range to filter the borrowed books.
   * @returns A Promise that resolves to an array of borrowed books.
   */
  async findBorrowedBooks(rangeDate?: IRangedDate) {
    const transactions = await this.prismaService.borrowingTransaction.findMany(
      {
        where: {
          returnedAt: null,
          borrowedAt: {
            gte: rangeDate?.from,
            lte: rangeDate?.to,
          },
        },
      },
    );

    return this.getTransactionBooks(transactions);
  }

  /**
   * Finds the borrowed books by a user within a specified date range.
   * @param userId - The ID of the user.
   * @param rangeDate - Optional date range to filter the borrowed books.
   * @returns A Promise that resolves to an array of borrowed books.
   */
  async findBorrowedBooksByUser(userId: number, rangeDate?: IRangedDate) {
    const transactions = await this.prismaService.borrowingTransaction.findMany(
      {
        where: {
          userId,
          returnedAt: null,
          borrowedAt: {
            gte: rangeDate?.from,
            lte: rangeDate?.to,
          },
        },
      },
    );

    return this.getTransactionBooks(transactions);
  }

  /**
   * Finds overdue books based on the given date range.
   * If no date range is provided, it returns all overdue books.
   *
   * @param rangeDate - Optional date range to filter the overdue books.
   * @returns A Promise that resolves to an array of books that are overdue.
   */
  async findOverdueBooks(rangeDate?: IRangedDate) {
    const transactions = await this.prismaService.borrowingTransaction.findMany(
      {
        where: {
          returnedAt: null,
          dueDate: {
            lt: new Date(),
          },
          borrowedAt: {
            gte: rangeDate?.from,
            lte: rangeDate?.to,
          },
        },
      },
    );

    return this.getTransactionBooks(transactions);
  }

  /**
   * Borrow a book for a user.
   *
   * @param bookId - The ID of the book to be borrowed.
   * @param borrowTransactionDto - The borrow transaction data.
   * @returns The created borrow transaction.
   * @throws BadRequestException if the user has already borrowed the book.
   */
  borrow(bookId: number, borrowTransactionDto: CreateBorrowTransactionDto) {
    const userId = borrowTransactionDto.userId;
    return this.prismaService.$transaction(async (trnsClient) => {
      // check if the book is available
      await this.booksService.isAvailable(bookId, trnsClient as any);
      // check if the user exists
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
        },
      });
    });
  }

  return(bookId: number, userId: number) {
    return this.prismaService.$transaction(async (trnsClient) => {
      // check if the user has borrowed the book
      const existingTransaction = await this.isAvailableToReturn(
        bookId,
        userId,
        trnsClient as any,
      );
      // increase book quantity by one
      await this.booksService.increaseQuantityByOne(bookId, trnsClient as any);
      // update the borrow transaction
      return await trnsClient.borrowingTransaction.update({
        where: {
          id: existingTransaction.id,
        },
        data: {
          returnedAt: new Date(),
        },
      });
    });
  }

  /**
   * Check if a book is available to be borrowed by a user.
   *
   * @param bookId - The ID of the book.
   * @param userId - The ID of the user.
   * @param prisma - The Prisma client instance.
   * @returns The existing transaction if the book is borrowed by the user, otherwise throws a BadRequestException.
   * @throws BadRequestException if the user has already borrowed the book.
   */
  async isAvailableToBorrow(
    bookId: number,
    userId: number,
    prisma: PrismaClient,
  ) {
    const existingTransaction = await this.findExistingTransaction(
      bookId,
      userId,
      prisma,
    );

    if (existingTransaction) {
      throw new BadRequestException(
        `User with ID = ${userId} has already borrowed the book with ID = ${bookId}`,
      );
    }

    return existingTransaction;
  }

  /**
   * Checks if a book is available to be returned by a user.
   *
   * @param bookId - The ID of the book.
   * @param userId - The ID of the user.
   * @param prisma - The Prisma client instance.
   * @returns The existing transaction if the book is borrowed by the user, otherwise throws a BadRequestException.
   */
  async isAvailableToReturn(
    bookId: number,
    userId: number,
    prisma: PrismaClient,
  ) {
    const existingTransaction = await this.findExistingTransaction(
      bookId,
      userId,
      prisma,
    );

    if (!existingTransaction) {
      throw new BadRequestException(
        `User with ID = ${userId} has not borrowed the book with ID = ${bookId}`,
      );
    }

    return existingTransaction;
  }

  /**
   * Finds an existing borrowing transaction for a given book and user.
   *
   * @param bookId - The ID of the book.
   * @param userId - The ID of the user.
   * @param prisma - The Prisma client instance.
   * @returns A Promise that resolves to the first borrowing transaction that matches the given book and user, and has not been returned yet.
   */
  findExistingTransaction(
    bookId: number,
    userId: number,
    prisma: PrismaClient,
  ) {
    return prisma.borrowingTransaction.findFirst({
      where: {
        bookId,
        userId,
        returnedAt: null,
      },
    });
  }

  isOverdue(transaction: { dueDate: Date; returnedAt: Date }) {
    return (
      new Date() > transaction.dueDate &&
      (!transaction.returnedAt || transaction.returnedAt > transaction.dueDate)
    );
  }

  // ****** Helper functions ****** //

  private getTransactionBooks(transactions: any[]) {
    return Promise.all(
      transactions.map(async (transaction) => {
        const book = await this.booksService.findOne(transaction.bookId);
        return {
          ...book,
          borrowerId: transaction.userId,
          borrowedAt: transaction.borrowedAt,
          dueDate: transaction.dueDate,
        };
      }),
    );
  }
}
