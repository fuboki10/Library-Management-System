import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
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
          return (
            value === undefined ||
            relatedValue === undefined ||
            value.toISOString() > relatedValue.toISOString()
          );
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

export const IsNotExistWith = (
  property: string,
  options?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsNotExistWith',
      constraints: [property],
      validator: {
        validate: (value: string, args: ValidationArguments): boolean => {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ] as string;
          return value !== undefined && relatedValue === undefined;
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + '$property must not be set with $constraint1',
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
  @Expose()
  id: number;
}

export class PaginationQueryDto {
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

export interface IRangedDate {
  from?: Date;
  to?: Date;
  since?: string;
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
  @Expose()
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
  @Expose()
  to: Date;

  @ApiProperty({
    name: 'since',
    type: String,
    required: false,
    enum: ['yesterday', 'lastweek', 'lastmonth', 'lastyear'],
  })
  @IsNotExistWith('from')
  @IsEnum(['yesterday', 'lastweek', 'lastmonth', 'lastyear'])
  @IsOptional()
  @Expose()
  since: string;
}
