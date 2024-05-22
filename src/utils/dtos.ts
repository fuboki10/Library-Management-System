import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FindByIdParamsDto {
  @ApiProperty({
    name: 'id',
    type: Number,
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id: number;
}
