import { convertToCSV, getCSVFileName } from './csv';

describe('convertToCSV', () => {
  it('should convert data to CSV format', () => {
    const data = [
      { name: 'John', age: 25, city: 'New York' },
      { name: 'Jane', age: 30, city: 'London' },
    ];
    const header = ['name', 'age', 'city'];

    const expectedCSV = ['name,age,city', 'John,25,New York', 'Jane,30,London'];

    const result = convertToCSV(data, header);

    expect(result).toEqual(expectedCSV);
  });

  it('should handle empty data', () => {
    const data: any[] = [];
    const header = ['name', 'age', 'city'];

    const expectedCSV = ['name,age,city'];

    const result = convertToCSV(data, header);

    expect(result).toEqual(expectedCSV);
  });

  it('should handle empty header', () => {
    const data = [
      { name: 'John', age: 25, city: 'New York' },
      { name: 'Jane', age: 30, city: 'London' },
    ];
    const header: string[] = [];

    const expectedCSV: string[] = [];

    const result = convertToCSV(data, header);

    expect(result).toEqual(expectedCSV);
  });
});

describe('getCSVFileName', () => {
  it('should return the correct CSV file name with both from and to dates', () => {
    const prefix = 'data';
    const rangeDate = {
      from: new Date('2022-01-01'),
      to: new Date('2022-01-31'),
    };

    const expectedFileName = 'from-2022-01-01-to-2022-01-31-data.csv';

    const result = getCSVFileName(prefix, rangeDate);

    expect(result).toEqual(expectedFileName);
  });

  it('should return the correct CSV file name with only from date', () => {
    const prefix = 'data';
    const rangeDate = {
      from: new Date('2022-01-01'),
      to: undefined,
    };

    const expectedFileName = 'from-2022-01-01-data.csv';

    const result = getCSVFileName(prefix, rangeDate);

    expect(result).toEqual(expectedFileName);
  });

  it('should return the correct CSV file name with only to date', () => {
    const prefix = 'data';
    const rangeDate = {
      from: undefined,
      to: new Date('2022-01-31'),
    };

    const expectedFileName = 'to-2022-01-31-data.csv';

    const result = getCSVFileName(prefix, rangeDate);

    expect(result).toEqual(expectedFileName);
  });

  it('should return the correct CSV file name with no date', () => {
    const prefix = 'data';
    const rangeDate = {
      from: undefined,
      to: undefined,
    };

    const expectedFileName = 'data.csv';

    const result = getCSVFileName(prefix, rangeDate);

    expect(result).toEqual(expectedFileName);
  });
});
