/**
 * @param {string} name
 * format name to be used as a file name
 * @returns {string}
 * @example
 * formatName('John Doe') // John_Doe
 * formatName('John Doe 123') // John_Doe_123
 */
export const formatName = (name: string): string => {
  return name.replace(/ /g, '_');
};
