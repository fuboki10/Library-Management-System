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

  findAll() {
    return this.prismaService.borrowingTransaction.findMany();
  }

  findOne(id: number) {
    return this.prismaService.borrowingTransaction.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Retrieves a list of borrowed books.
   * @returns A promise that resolves to an array of borrowed books with additional transaction details.
   */
  async findBorrowedBooks() {
    const transactions = await this.prismaService.borrowingTransaction.findMany(
      {
        where: {
          returnedAt: null,
        },
      },
    );

    return this.getTransactionBooks(transactions);
  }

  /**
   * Finds the borrowed books by a user.
   *
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to an array of borrowed books.
   */
  async findBorrowedBooksByUser(userId: number) {
    const transactions = await this.prismaService.borrowingTransaction.findMany(
      {
        where: {
          userId,
          returnedAt: null,
        },
      },
    );

    return this.getTransactionBooks(transactions);
  }

  async findOverdueBooks() {
    const transactions = await this.prismaService.borrowingTransaction.findMany(
      {
        where: {
          returnedAt: null,
          dueDate: {
            lt: new Date(),
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
   * @param userId - The ID of the user borrowing the book.
   * @param borrowTransactionDto - The borrow transaction data.
   * @returns The created borrow transaction.
   * @throws BadRequestException if the user has already borrowed the book.
   */
  borrow(
    bookId: number,
    userId: number,
    borrowTransactionDto: CreateBorrowTransactionDto,
  ) {
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
          userId,
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
