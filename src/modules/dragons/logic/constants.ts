export const DragonElements = {
  Fire: 'fire',
  Ice: 'ice',
  Lightning: 'lightning',
  Earth: 'earth',
  Water: 'water',
  Wind: 'wind',
} as const;

export type DragonElementValues = (typeof DragonElements)[keyof typeof DragonElements];
