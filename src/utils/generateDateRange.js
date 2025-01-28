import { formatDate } from './formatDate';

export const generateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  while (start <= end) {
    dates.push(formatDate(start));
    start.setDate(start.getDate() + 1);
  }
  return dates;
};