export type RadioOption<T = any> = {
  value: number | string;
  label: string;
  disabled?: boolean;
  item?: T;
};
