import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    type: Number,
    description: 'The user ID',
    default: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Email address of the user',
    default: 'email@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Real name of the user',
    default: 'Abdelrahman Tarek',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'User Type, e.g. admin, user, etc.',
    default: 'user',
  })
  type: string;
}
