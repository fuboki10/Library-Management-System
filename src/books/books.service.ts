import { Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  constructor(private readonly prismaService: PrismaService) {}

  create(createBookDto: CreateBookDto) {
    return this.prismaService.book.create({
      data: {
        title: createBookDto.title,
        author: createBookDto.author,
        ISBN: createBookDto.ISBN,
        availableQuantity: createBookDto.availableQuantity,
        shelfLocation: createBookDto.shelfLocation,
      },
    });
  }

  findAll() {
    return this.prismaService.book.findMany();
  }

  findOne(id: number) {
    return this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return this.prismaService.book.delete({
      where: {
        id,
      },
    });
  }
}
