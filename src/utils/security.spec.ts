import { comparePasswords, hashPassword } from './security';

describe('hash password', () => {
  it('hash password', async () => {
    const password = '12341234';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).not.toEqual(password);
  });

  it('compare password', async () => {
    const password = '12341234';
    const hashedPassword = await hashPassword(password);
    expect(comparePasswords(password, hashedPassword)).toBeTruthy();
  });
});
