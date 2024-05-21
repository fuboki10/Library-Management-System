import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty({
    type: Number,
    description: 'The book ID',
    default: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The title of the book',
    default: 'Book Title',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'The author of the book',
    default: 'Author Name',
  })
  author: string;

  @ApiProperty({
    type: String,
    description: 'The ISBN of the book',
    default: '978-3-16-148410-0',
  })
  ISBN: string;

  @ApiProperty({
    type: Number,
    description: 'The quantity of the book available',
    default: 10,
  })
  availableQuantity: number;

  @ApiProperty({
    type: String,
    description: 'The shelf location of the book',
    default: 'A1',
  })
  shelfLocation: string;
}
