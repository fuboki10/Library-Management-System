import { getCurrentTimestamp, convertSinceToDate } from '../utils/time';

describe('getCurrentTimestamp', () => {
  it('should return the current timestamp in the correct format', () => {
    const timestamp = getCurrentTimestamp();
    const regex = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/;
    expect(timestamp).toMatch(regex);
  });
});

describe('convertSinceToDate', () => {
  it('should return the date for yesterday', () => {
    const yesterday = convertSinceToDate('yesterday');
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - 1);
    expect(yesterday.toDateString()).toEqual(expectedDate.toDateString());
  });

  it('should return the date for last week', () => {
    const lastWeek = convertSinceToDate('lastweek');
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - 7);
    expect(lastWeek.toDateString()).toEqual(expectedDate.toDateString());
  });

  it('should return the date for last month', () => {
    const lastMonth = convertSinceToDate('lastmonth');
    const expectedDate = new Date();
    expectedDate.setMonth(expectedDate.getMonth() - 1);
    expect(lastMonth.toDateString()).toEqual(expectedDate.toDateString());
  });

  it('should return the date for last year', () => {
    const lastYear = convertSinceToDate('lastyear');
    const expectedDate = new Date();
    expectedDate.setFullYear(expectedDate.getFullYear() - 1);
    expect(lastYear.toDateString()).toEqual(expectedDate.toDateString());
  });

  it('should throw an error for an invalid since value', () => {
    expect(() => convertSinceToDate('invalid')).toThrowError(
      'Invalid since value provided: invalid',
    );
  });
});
