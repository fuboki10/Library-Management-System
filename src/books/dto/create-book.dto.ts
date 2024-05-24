import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsISBN,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    type: String,
    description: 'The title of the book',
    default: 'Book Title',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Expose()
  title: string;

  @ApiProperty({
    type: String,
    description: 'The author of the book',
    default: 'Author Name',
  })
  @IsString({ message: 'Author must be a string' })
  @IsNotEmpty({ message: 'Author is required' })
  @Expose()
  author: string;

  @ApiProperty({
    type: String,
    description: 'The ISBN of the book',
    default: '227551065-6',
  })
  @IsString({ message: 'ISBN must be a string' })
  @IsNotEmpty({ message: 'ISBN is required' })
  @IsISBN(10, { message: 'Invalid ISBN' })
  @Expose()
  ISBN: string;

  @ApiProperty({
    type: Number,
    description: 'The quantity of the book available',
    default: 10,
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Type(() => Number)
  @Expose()
  availableQuantity: number;

  @ApiProperty({
    type: String,
    description: 'The shelf location of the book',
    default: 'A1',
  })
  @IsString({ message: 'Shelf Location must be a string' })
  @IsNotEmpty({ message: 'Shelf Location is required' })
  @MinLength(2, {
    message: 'Shelf Location must be at least 2 characters long',
  })
  @Expose()
  shelfLocation: string;
}
