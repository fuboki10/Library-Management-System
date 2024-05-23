export const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

export const convertSinceToDate = (since: string): Date => {
  const now = new Date();
  switch (since) {
    case 'yesterday':
      return new Date(now.setDate(now.getDate() - 1));
    case 'lastweek':
      return new Date(now.setDate(now.getDate() - 7));
    case 'lastmonth':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'lastyear':
      return new Date(now.setFullYear(now.getFullYear() - 1));

    default:
      throw new Error(`Invalid since value provided: ${since}`);
  }
};
