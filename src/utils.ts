const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  bold: "\x1b[1m", // not a color
  gray: "\x1b[90m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  yellow: "\x1b[33m",
} as const;

export type ColorKey = keyof typeof colors;

/**
 * @param str - string to print in color
 * @param c - pre-defined color string from `colors` object
 * @returns Original string surrounded by color code and reset code.
 */
export const color = (str: string, c: keyof typeof colors) =>
  `${colors[c]}${str}${colors.reset}`;
