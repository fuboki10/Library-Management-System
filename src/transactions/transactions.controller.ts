import { Controller, Post, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateBorrowTransactionDto } from './dto/borrow-transaction.dto';
import { FindByIdParamsDto } from '../utils/dtos';

@ApiTags('transactions')
@Controller({
  path: 'books/:id',
  version: '1',
})
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('borrow')
  create(
    @Param() { id }: FindByIdParamsDto,
    @Body() borrowTransactionDto: CreateBorrowTransactionDto,
  ) {
    return this.transactionsService.borrow(id, 1, borrowTransactionDto);
  }

  @Post('return')
  return(@Param() { id }: FindByIdParamsDto) {
    return this.transactionsService.return(id, 1);
  }
}
