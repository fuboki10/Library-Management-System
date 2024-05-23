import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
  buildMessage,
} from 'class-validator';

// **************** Decorators **************** //

/**
 * Decorator function that validates if a date property is after another date property.
 * @param property - The name of the related date property.
 * @param options - Optional validation options.
 * @returns A property decorator function.
 */
export const IsAfter = (
  property: string,
  options?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsAfter',
      constraints: [property],
      validator: {
        validate: (value: Date, args: ValidationArguments): boolean => {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ] as Date;
          return value.toISOString() > relatedValue.toISOString();
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + '$property must be after $constraint1',
          options,
        ),
      },
    },
    options,
  );

// **************** DTO **************** //

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

export interface IRangedDate {
  from?: Date;
  to?: Date;
}

export class RangeDateQueryDto implements IRangedDate {
  @ApiProperty({
    name: 'from',
    type: Date,
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  from: Date;

  @ApiProperty({
    name: 'to',
    type: Date,
    required: false,
  })
  @IsAfter('from')
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  to: Date;
}
