import { PartialType, PickType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class SearchBookDto extends PartialType(
  // Search for the book by its title, author, or ISBN.
  PickType(CreateBookDto, ['title', 'author', 'ISBN'] as const),
) {}
