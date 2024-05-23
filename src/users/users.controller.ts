import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindByIdParamsDto } from '../utils/dtos';
import { TransactionsService } from '../transactions/transactions.service';
import { BorrowedBookDto } from '../books/dto/borrowed-book.dto';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: UserDto, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  async findOne(@Param() { id }: FindByIdParamsDto) {
    return this.returnUserOrThrow(
      (await this.usersService.findOne(id)) as unknown as UserDto,
      id,
    );
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  async update(
    @Param() { id }: FindByIdParamsDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.returnUserOrThrow(
      (await this.usersService.update(id, updateUserDto)) as unknown as UserDto,
      id,
    );
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  async remove(@Param() { id }: FindByIdParamsDto) {
    return this.returnUserOrThrow(
      (await this.usersService.remove(id)) as unknown as UserDto,
      id,
    );
  }

  @Get(':id/books/borrowed')
  @ApiResponse({ status: HttpStatus.OK, type: BorrowedBookDto, isArray: true })
  async getBorrowedBooks(@Param() { id }: FindByIdParamsDto) {
    return this.transactionsService.findBorrowedBooksByUser(id);
  }

  // ****** Helper functions ****** //

  /**
   * Returns the user if it exists, otherwise throws a NotFoundException.
   *
   * @param user - The user to be returned.
   * @param id - The ID of the user.
   * @returns The user if it exists.
   * @throws NotFoundException if the user does not exist.
   */
  private returnUserOrThrow(user: UserDto | null, id: number) {
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
