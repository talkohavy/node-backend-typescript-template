import { ReactNode } from 'react';

export type SelectOption = {
  value: string | number;
  label: ReactNode;
  [extraKey: string]: any;
};
