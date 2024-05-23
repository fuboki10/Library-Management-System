import { IRangedDate } from './dtos';

export const convertToCSV = (data: any[], header: string[]) => {
  const csv = [];
  if (header.length === 0) {
    return csv;
  }

  csv.push(header.join(','));

  data.forEach((row) => {
    const rowValues = [];
    header.forEach((column) => {
      if (!Object.prototype.hasOwnProperty.call(row, column)) {
        rowValues.push('');
      } else if (row[column] instanceof Date) {
        rowValues.push((row[column] as Date).toISOString().split('T')[0]);
      } else {
        rowValues.push(row[column]);
      }
    });

    if (rowValues.length === 0) {
      return;
    }

    csv.push(rowValues.join(','));
  });
  return csv;
};

export const getCSVFileName = (prefix: string, rangeDate: IRangedDate) => {
  const period_start = rangeDate?.from
    ? `from-${rangeDate.from.toISOString().split('T')[0]}-`
    : '';
  const period_end = rangeDate?.to
    ? `to-${rangeDate.to.toISOString().split('T')[0]}-`
    : '';
  return `${period_start}${period_end}${prefix}.csv`;
};
