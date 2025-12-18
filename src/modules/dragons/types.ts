import type { DragonElementValues } from './logic/constants';

export type Dragon = {
  id: number;
  name: string;
  element: DragonElementValues;
  /**
   * The wing span of the dragon in meters
   */
  wingSpan: number;
  /**
   * The age of the dragon in years
   */
  age: number;
};
