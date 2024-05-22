import { Prisma } from '@prisma/client';

/**
 * Maps a DTO object to a Prisma startsWith search query.
 * @param dto - The DTO object containing the search parameters.
 * @param mode - The Prisma query mode.
 * @returns The mapped startsWith search query.
 */
export function mapDtoToStartsWithSearchQuery<Type>(
  dto: unknown,
  mode?: Prisma.QueryMode,
): Type {
  const query = {};
  Object.keys(dto).forEach((key) => {
    if (dto[key]) {
      query[key] = {
        startsWith: dto[key],
        mode: mode,
      };
    }
  });

  return query as Type;
}
