import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
  buildMessage,
} from 'class-validator';

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
