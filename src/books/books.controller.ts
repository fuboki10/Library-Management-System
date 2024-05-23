import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookDto } from './dto/book.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchBookDto } from './dto/search-book.dto';
import { FindByIdParamsDto, RangeDateQueryDto } from '../utils/dtos';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateBorrowTransactionDto } from '../transactions/dto/borrow-transaction.dto';
import { BorrowedBookDto } from './dto/borrowed-book.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { convertToCSV, getCSVFileName } from '../utils/csv';
import { Response } from 'express';
import { convertSinceToDate } from '../utils/time';

@ApiTags('books')
@Controller({
  path: 'books',
  version: '1',
})
@UseGuards(ThrottlerGuard)
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: BookDto })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: BookDto, isArray: true })
  findAll(@Query() searchBookQuery: SearchBookDto) {
    return this.booksService.findAll(searchBookQuery);
  }

  @Get('borrowed')
  @ApiResponse({ status: HttpStatus.OK, type: BorrowedBookDto, isArray: true })
  borrowed(@Query() rangeDate: RangeDateQueryDto) {
    if (rangeDate?.since) {
      rangeDate.from = convertSinceToDate(rangeDate.since);
    }

    return this.transactionsService.findBorrowedBooks(rangeDate);
  }

  @Get('borrowed/csv')
  @ApiOkResponse({
    description: 'Return a CSV file with borrowed books',
    headers: {
      'Content-Type': {
        description: 'text/csv',
      },
    },
  })
  async borrowedCSV(
    @Res() res: Response,
    @Query() rangeDate: RangeDateQueryDto,
  ) {
    if (rangeDate?.since) {
      rangeDate.from = convertSinceToDate(rangeDate.since);
    }

    const data = await this.transactionsService.findBorrowedBooks(rangeDate);
    const csv = convertToCSV(data, [
      'id',
      'title',
      'author',
      'ISBN',
      'availableQuantity',
      'shelfLocation',
      'borrowedAt',
      'dueDate',
      'borrowerId',
    ]);

    const fileName = getCSVFileName('borrowed-books', rangeDate);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send(csv.join('\r\n'));
  }

  @Get('borrowed/overdue')
  @ApiResponse({ status: HttpStatus.OK, type: BorrowedBookDto, isArray: true })
  overdue(@Query() rangeDate: RangeDateQueryDto) {
    if (rangeDate?.since) {
      rangeDate.from = convertSinceToDate(rangeDate.since);
    }

    return this.transactionsService.findOverdueBooks(rangeDate);
  }

  @Get('borrowed/overdue/csv')
  @ApiOkResponse({
    description: 'Return a CSV file with overdue books',
    headers: {
      'Content-Type': {
        description: 'text/csv',
      },
    },
  })
  async overdueCSV(
    @Res() res: Response,
    @Query() rangeDate: RangeDateQueryDto,
  ) {
    if (rangeDate?.since) {
      rangeDate.from = convertSinceToDate(rangeDate.since);
    }

    const data = await this.transactionsService.findOverdueBooks(rangeDate);
    const csv = convertToCSV(data, [
      'id',
      'title',
      'author',
      'ISBN',
      'availableQuantity',
      'shelfLocation',
      'borrowedAt',
      'dueDate',
      'borrowerId',
    ]);

    const fileName = getCSVFileName('overdue-books', rangeDate);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.status(200).send(csv.join('\r\n'));
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: BookDto })
  async findOne(@Param() { id }: FindByIdParamsDto) {
    return this.returnBookOrThrow(await this.booksService.findOne(id), id);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: BookDto })
  async update(
    @Param() { id }: FindByIdParamsDto,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.returnBookOrThrow(
      await this.booksService.update(id, updateBookDto),
      id,
    );
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: BookDto })
  async remove(@Param() { id }: FindByIdParamsDto) {
    return this.returnBookOrThrow(await this.booksService.remove(id), id);
  }

  @Post(':id/borrow')
  borrow(
    @Param() { id }: FindByIdParamsDto,
    @Body() borrowTransactionDto: CreateBorrowTransactionDto,
  ) {
    return this.transactionsService.borrow(id, borrowTransactionDto);
  }

  @Post(':id/return')
  return(@Param() { id }: FindByIdParamsDto) {
    return this.transactionsService.return(id, 1);
  }

  // ****** Helper functions ****** //

  /**
   * Returns the book if it exists, otherwise throws a NotFoundException.
   *
   * @param book - The book to be returned.
   * @param id - The ID of the book.
   * @returns The book if it exists.
   * @throws NotFoundException if the book does not exist.
   */
  private returnBookOrThrow(book: BookDto | null, id: number) {
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }
}
