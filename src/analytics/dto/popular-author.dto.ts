import { PickType } from '@nestjs/swagger';
import { PopularBookDto } from './popular-book.dto';

export class PopularAuthorDto extends PickType(PopularBookDto, [
  'author',
  'borrowCount',
] as const) {}
