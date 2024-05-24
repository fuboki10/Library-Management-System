import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IRangedDate } from '../utils/dtos';
import { TransactionsService } from '../transactions/transactions.service';
import { BorrowingTransaction } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionsService: TransactionsService,
  ) {}

  /**
   * Retrieves the popular books based on the number of borrowings.
   * Returns an array of popular books with their details and borrow count.
   * @returns A promise that resolves to an array of popular books.
   */
  async getPopularBooks() {
    this.logger.debug('Retrieving popular books...');
    // get top 10 books that has transactions
    // join books table with borrowingTransaction table
    const books: { id: number; borrow_count: string }[] = await this
      .prismaService.$queryRaw`SELECT "Book".id, COUNT(*) as borrow_count
      FROM "Book"
      JOIN "BorrowingTransaction" ON "Book".id = "BorrowingTransaction"."bookId"
      GROUP BY "Book".id
      ORDER BY borrow_count DESC
      LIMIT 10;`;

    this.logger.debug(`Retrieved popular books. Count: ${books.length} books`);

    return Promise.all(
      books.map(async (book) => {
        const bookDetails = await this.prismaService.book.findUnique({
          where: {
            id: book.id,
          },
        });

        return {
          ...bookDetails,
          borrowCount: parseInt(book.borrow_count),
        };
      }),
    );
  }

  /**
   * Retrieves the popular authors based on the number of book borrowings.
   * Returns an array of popular authors with their borrow counts.
   * @returns An array of popular authors with their borrow counts.
   */
  async getPopularAuthors() {
    this.logger.debug('Retrieving popular authors...');
    // get top 10 authors that has transactions
    const authors: { author: string; borrow_count: string }[] = await this
      .prismaService.$queryRaw`SELECT "Book".author, COUNT(*) as borrow_count
      FROM "Book"
      JOIN "BorrowingTransaction" ON "Book".id = "BorrowingTransaction"."bookId"
      GROUP BY "Book".author
      ORDER BY borrow_count DESC
      LIMIT 10;`;

    this.logger.debug(
      `Retrieved popular authors. Count: ${authors.length} authors`,
    );

    return authors.map((author) => ({
      author: author.author,
      borrowCount: parseInt(author.borrow_count),
    }));
  }

  /**
   * Retrieves and analyzes transactions within a specified date range.
   * @param rangeDate - The date range for which to retrieve transactions.
   * @returns An object containing the analyzed transactions and various counts.
   */
  async getTransactionsAnalysis(rangeDate: IRangedDate) {
    this.logger.debug('Retrieving transactions analysis...');
    const transactions = await this.transactionsService.findAll(rangeDate);
    this.logger.debug(
      `Retrieved transactions analysis. Count: ${transactions.length}`,
    );

    const extendedTransactions = transactions.map(
      (
        transaction,
      ): BorrowingTransaction & { returned: boolean; overdue: boolean } => {
        const returned = transaction.returnedAt ? true : false;
        const overdue = this.transactionsService.isOverdue(transaction);

        return { ...transaction, returned, overdue };
      },
    );

    // perform analysis here
    const returnedCount = extendedTransactions.filter((t) => t.returned).length;
    const overdueCount = extendedTransactions.filter((t) => t.overdue).length;
    const borrowedCount = extendedTransactions.length - returnedCount;

    return {
      transactions: extendedTransactions,
      returnedCount,
      overdueCount,
      borrowedCount,
    };
  }
}
