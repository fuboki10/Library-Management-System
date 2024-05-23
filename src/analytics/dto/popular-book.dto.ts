import { ApiProperty } from '@nestjs/swagger';
import { BookDto } from '../../books/dto';

export class PopularBookDto extends BookDto {
  @ApiProperty({
    description: 'The number of times this book has been borrowed',
    example: 5,
  })
  borrowCount: number;
}
