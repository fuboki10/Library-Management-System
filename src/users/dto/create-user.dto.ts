import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'The username',
    minLength: 4,
    default: 'username',
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(4, {
    message: 'Username must be at least 4 characters long',
  })
  @Expose()
  username: string;

  @ApiProperty({
    type: String,
    description: 'The password',
    minLength: 8,
    default: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @Expose()
  password: string;

  @ApiProperty({
    type: String,
    description: 'Real name of the user',
    default: 'Abdelrahman Tarek',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1, {
    message: 'Name must be at least 1 characters long',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Email address of the user',
    default: 'email@example.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The role of the user',
    default: 'user',
  })
  @IsString({ message: 'Role must be a string' })
  @IsEnum(['user', 'admin'], {
    message: 'Invalid role',
  })
  @IsOptional()
  @Expose()
  type: string;
}
