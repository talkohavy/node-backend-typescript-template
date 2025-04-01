import FakeRadioDot from './FakeRadioDot';
import RadioGroupWrapper from '../logic/RadioGroupWrapper';
import { RadioOption } from '../types';

type RadioDotsProps<T> = {
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  className?: string;
};

export default function RadioDots<T>(props: RadioDotsProps<T>) {
  return (
    <RadioGroupWrapper {...props}>
      <FakeRadioDot />
    </RadioGroupWrapper>
  );
}
