import { mapDtoToStartsWithSearchQuery } from './query';

describe('mapDtoToStartsWithSearchQuery', () => {
  it('should return an empty object if dto is empty', () => {
    const dto = {};
    const result = mapDtoToStartsWithSearchQuery(dto);
    expect(result).toEqual({});
  });

  it('should return the correct query object for a non-empty dto', () => {
    const dto = {
      name: 'John',
      age: 25,
    };
    const result = mapDtoToStartsWithSearchQuery(dto);
    expect(result).toEqual({
      name: {
        startsWith: 'John',
      },
      age: {
        startsWith: 25,
      },
    });
  });

  it('should include the mode in the query object if provided', () => {
    const dto = {
      name: 'John',
    };
    const mode = 'insensitive';
    const result = mapDtoToStartsWithSearchQuery(dto, mode);
    expect(result).toEqual({
      name: {
        startsWith: 'John',
        mode: 'insensitive',
      },
    });
  });
});
