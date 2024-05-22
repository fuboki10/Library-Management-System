import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindByIdParamsDto } from '../utils/dtos';
import { BorrowTransactionDto } from './dto/borrow-transaction.dto';

@ApiTags('transactions')
@Controller({
  path: 'transactions',
  version: '1',
})
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: BorrowTransactionDto,
    isArray: true,
  })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: BorrowTransactionDto })
  async findOne(@Param() { id }: FindByIdParamsDto) {
    return this.returnTransactionOrThrow(
      await this.transactionsService.findOne(id),
      id,
    );
  }

  // ****** Helper functions ****** //

  /**
   * Returns the transaction if it exists, otherwise throws a NotFoundException.
   *
   * @param transaction - The transaction to be returned.
   * @param id - The ID of the transaction.
   * @returns The transaction if it exists.
   * @throws NotFoundException if the transaction does not exist.
   */
  private returnTransactionOrThrow(
    transaction: BorrowTransactionDto | null,
    id: number,
  ) {
    if (!transaction) {
      throw new NotFoundException(`transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
