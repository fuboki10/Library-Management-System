import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';

export class BorrowTransactionDto {
  @ApiProperty({
    type: Number,
    description: 'The ID of the book being borrowed',
    default: 1,
    required: true,
  })
  @IsInt({ message: 'Book ID must be an integer' })
  @Type(() => Number)
  bookId: number;

  @ApiProperty({
    type: Number,
    description: 'The ID of the user borrowing the book',
    default: 1,
    required: true,
  })
  @IsInt({ message: 'User ID must be an integer' })
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    type: Date,
    description: 'The date the book is borrowed',
    default: '2024-05-22',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  borrowedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'The date the book is returned',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  returnDate?: Date;

  @ApiProperty({
    type: Date,
    description: 'Due Date',
    default: '2024-05-22',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;
}

export class CreateBorrowTransactionDto extends OmitType(BorrowTransactionDto, [
  'returnDate',
  'bookId',
] as const) {}
