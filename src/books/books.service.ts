import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, SearchBookDto, UpdateBookDto } from './dto';
import { Prisma } from '@prisma/client';
import { mapDtoToStartsWithSearchQuery } from '../prisma/utils/query';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new book.
   * @param createBookDto - The data for creating a book.
   * @returns A promise that resolves to the created book.
   */
  create(createBookDto: CreateBookDto) {
    this.logger.debug('Creating book...');

    return this.prismaService.book.create({
      data: createBookDto,
    });
  }

  /**
   * Retrieves all books.
   * @returns A promise that resolves to an array of books.
   */
  /**
   * Retrieves a list of books based on the provided search criteria.
   * @param searchBookQuery - The search criteria for filtering the books.
   * @returns A Promise that resolves to an array of books matching the search criteria.
   */
  findAll(searchBookQuery: SearchBookDto) {
    const where = mapDtoToStartsWithSearchQuery<Prisma.BookWhereInput>(
      searchBookQuery,
      'insensitive',
    );

    // override the startsWith search for ISBN, to use an exact match for the hash index
    where.ISBN = searchBookQuery.ISBN;

    return this.prismaService.book.findMany({
      where,
    });
  }

  /**
   * Retrieves a book by its ID.
   * @param id - The ID of the book to retrieve.
   * @returns A promise that resolves to the retrieved book.
   */
  findOne(id: number) {
    return this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Updates a book by its ID.
   * @param id - The ID of the book to update.
   * @param updateBookDto - The data for updating the book.
   * @returns A promise that resolves to the updated book.
   */
  update(id: number, updateBookDto: UpdateBookDto) {
    this.logger.debug(`Updating book with ID = ${id}...`);
    return this.prismaService.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  /**
   * Removes a book by its ID.
   * @param id - The ID of the book to remove.
   * @returns A promise that resolves when the book is successfully removed.
   */
  remove(id: number) {
    this.logger.debug(`Deleting book with ID = ${id}...`);
    return this.prismaService.book.delete({
      where: {
        id,
      },
    });
  }
}
