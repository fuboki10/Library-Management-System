import { getCurrentTimestamp } from '../utils/time';

describe('getCurrentTimestamp', () => {
  it('should return the current timestamp in the correct format', () => {
    const timestamp = getCurrentTimestamp();
    const regex = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/;
    expect(timestamp).toMatch(regex);
  });
});
