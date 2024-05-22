import { ApiProperty } from '@nestjs/swagger';
import { BookDto } from './book.dto';

export class BorrowedBookDto extends BookDto {
  @ApiProperty({
    type: Number,
    description: 'The ID of the borrower',
    default: 1,
  })
  borrowerId: number;

  @ApiProperty({
    type: Date,
    description: 'The date the book was borrowed',
    default: '2024-05-22',
  })
  borrowedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'The due date of the book',
    default: '2024-05-22',
  })
  dueDate: Date;
}
