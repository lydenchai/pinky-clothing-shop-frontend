export const ColorEnum = {
  // Basics
  white: 'white',
  black: 'black',
  gray: 'gray',
  silver: 'silver',
  beige: 'beige',
  ivory: 'ivory',
  cream: 'cream',
  offWhite: 'offWhite',

  // Blues
  blue: 'blue',
  navy: 'navy',
  skyBlue: 'skyBlue',
  babyBlue: 'babyBlue',
  royalBlue: 'royalBlue',
  denim: 'denim',
  indigo: 'indigo',
  teal: 'teal',
  aqua: 'aqua',
  cyan: 'cyan',

  // Reds / Pinks
  red: 'red',
  maroon: 'maroon',
  burgundy: 'burgundy',
  wine: 'wine',
  pink: 'pink',
  blush: 'blush',
  rose: 'rose',
  coral: 'coral',
  magenta: 'magenta',

  // Greens
  green: 'green',
  olive: 'olive',
  sage: 'sage',
  mint: 'mint',
  lime: 'lime',
  emerald: 'emerald',
  forestGreen: 'forestGreen',

  // Yellows / Oranges
  yellow: 'yellow',
  mustard: 'mustard',
  gold: 'gold',
  orange: 'orange',
  peach: 'peach',
  apricot: 'apricot',

  // Purples
  purple: 'purple',
  violet: 'violet',
  lavender: 'lavender',
  plum: 'plum',

  // Browns / Neutrals
  brown: 'brown',
  tan: 'tan',
  camel: 'camel',
  chocolate: 'chocolate',
  khaki: 'khaki',

  // Trend / Special
  nude: 'nude',
  charcoal: 'charcoal',
  slate: 'slate',
  mocha: 'mocha',
  rust: 'rust',
  copper: 'copper',
} as const;

export type ColorEnum = (typeof ColorEnum)[keyof typeof ColorEnum];
