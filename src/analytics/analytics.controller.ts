import { Controller, Get, Query, Res } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PopularBookDto } from './dto/popular-book.dto';
import { PopularAuthorDto } from './dto/popular-author.dto';
import { convertToCSV, getCSVFileName } from '../utils/csv';
import { Response } from 'express';
import { RangeDateQueryDto } from '../utils/dtos';
import { convertSinceToDate } from '../utils/time';
import { ExtendedBorrowingTransactionListDto } from './dto/extended-borrow-transaction.dto';

@ApiTags('analytics')
@Controller({
  path: 'analytics',
  version: '1',
})
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('books/popular')
  @ApiOkResponse({ type: PopularBookDto, isArray: true })
  async popularBooks() {
    return this.analyticsService.getPopularBooks();
  }

  @Get('authors/popular')
  @ApiOkResponse({ type: PopularAuthorDto, isArray: true })
  async popularAuthors() {
    return this.analyticsService.getPopularAuthors();
  }

  @Get('transactions')
  @ApiOkResponse({
    description: 'Return all transactions with analysis data',
    type: ExtendedBorrowingTransactionListDto,
  })
  async transactions(@Query() rangeDate: RangeDateQueryDto) {
    if (rangeDate?.since) {
      rangeDate.from = convertSinceToDate(rangeDate.since);
    }

    return this.analyticsService.getTransactionsAnalysis(rangeDate);
  }

  // ***** TO CSV ENDPOINTS *****

  @Get('books/popular/csv')
  @ApiOkResponse({
    description: 'Return a CSV file with popular books',
    headers: {
      'Content-Type': {
        description: 'text/csv',
      },
    },
  })
  async popularBooksToCSV(@Res() res: Response) {
    const popularBooks = await this.analyticsService.getPopularBooks();
    const csv = convertToCSV(popularBooks, [
      'id',
      'title',
      'author',
      'ISBN',
      'borrowCount',
    ]);

    const fileName = getCSVFileName('popular-books', {});

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send(csv.join('\r\n'));
  }

  @Get('authors/popular/csv')
  @ApiOkResponse({
    description: 'Return a CSV file with popular authors',
    headers: {
      'Content-Type': {
        description: 'text/csv',
      },
    },
  })
  async popularAuthorsToCSV(@Res() res: Response) {
    const popularAuthors = await this.analyticsService.getPopularAuthors();
    const csv = convertToCSV(popularAuthors, ['author', 'borrowCount']);

    const fileName = getCSVFileName('popular-authors', {});

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send(csv.join('\r\n'));
  }

  @Get('transactions/csv')
  @ApiOkResponse({
    description: 'Return a CSV file with transactions with analysis data',
    headers: {
      'Content-Type': {
        description: 'text/csv',
      },
    },
  })
  async transactionsToCSV(
    @Res() res: Response,
    @Query() rangeDate: RangeDateQueryDto,
  ) {
    if (rangeDate?.since) {
      rangeDate.from = convertSinceToDate(rangeDate.since);
    }

    const data = await this.analyticsService.getTransactionsAnalysis(rangeDate);
    const csv = convertToCSV(data.transactions, [
      'id',
      'bookId',
      'userId',
      'borrowedAt',
      'returnedAt',
      'dueDate',
      'returned',
      'overdue',
    ]);

    // Add the total counts to the CSV
    csv[0] = [csv[0], 'returnedCount', 'overdueCount', 'borrowedCount'].join(
      ',',
    );
    csv[1] = [
      csv[1],
      data.returnedCount,
      data.overdueCount,
      data.borrowedCount,
    ].join(',');

    const fileName = getCSVFileName('transactions', rangeDate);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send(csv.join('\r\n'));
  }
}
