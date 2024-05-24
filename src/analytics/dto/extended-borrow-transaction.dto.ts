import { ApiProperty } from '@nestjs/swagger';
import { BorrowTransactionDto } from '../../transactions/dto/borrow-transaction.dto';

export class ExtendedBorrowingTransactionDto extends BorrowTransactionDto {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates whether the book has been returned',
    default: false,
  })
  returned: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Indicates whether the book is overdue',
    default: false,
  })
  overdue: boolean;
}

export class ExtendedBorrowingTransactionListDto {
  @ApiProperty({
    type: ExtendedBorrowingTransactionDto,
    isArray: true,
    description: 'List of borrowing transactions with extended details',
  })
  transactions: ExtendedBorrowingTransactionDto[];

  @ApiProperty({
    type: Number,
    description: 'Total number of returned books',
  })
  returnedCount: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of overdue books',
  })
  overdueCount: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of borrowed books',
  })
  borrowedCount: number;
}
