const color = (num: number) => `\x1b[${num}m`;

export const COLORS = {
  black: color(30),
  blink: color(5),
  blue: color(34),
  bold: color(1),
  cyan: color(36),
  green: color(32),
  magenta: color(35),
  red: color(31),
  white: color(37),
  yellow: color(33),
  stop: '\x1b[0m',
};
