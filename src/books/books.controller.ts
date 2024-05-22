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
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookDto } from './dto/book.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchBookDto } from './dto/search-book.dto';
import { FindByIdParamsDto } from '../utils/dtos';

@ApiTags('books')
@Controller({
  path: 'books',
  version: '1',
})
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

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
