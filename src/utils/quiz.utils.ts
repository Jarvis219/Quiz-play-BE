import { randomUUID } from 'crypto';

export const generateSlug = (title: string): string => {
  return (
    title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '') +
    '-' +
    randomUUID().slice(0, 7)
  );
};

export const generateCode = (count = 7) => {
  return randomUUID().slice(0, count).toLocaleUpperCase();
};
