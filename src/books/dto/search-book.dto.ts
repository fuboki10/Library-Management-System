import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class SearchBookDto extends PartialType(
  // Search for the book by its title, author, or ISBN.
  PickType(CreateBookDto, ['title', 'author', 'ISBN'] as const),
) {
  @ApiProperty({
    name: 'offset',
    type: Number,
    required: false,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  @Expose()
  offset: number = 0;

  @ApiProperty({
    name: 'limit',
    type: Number,
    required: false,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  @Expose()
  limit: number = 10;
}
