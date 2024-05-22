import { Prisma } from '@prisma/client';

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
