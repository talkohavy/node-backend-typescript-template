import { PropsWithChildren } from 'react';
import { RadioOption } from '../../types';

type RadioGroupWrapperProps<T> = PropsWithChildren<{
  value: number | string;
  setValue: (value: any) => void;
  options: Array<RadioOption<T>>;
  className?: string;
}>;

export default function RadioGroupWrapper<T>(props: RadioGroupWrapperProps<T>) {
  const { children, value: selectedValue, setValue, options, className } = props;

  return (
    <div className={className}>
      {options.map(({ value: currentItemValue, disabled }) => {
        const isChecked = selectedValue === currentItemValue;

        return (
          <div key={currentItemValue} className='group/radioWrapper relative'>
            <input
              type='radio'
              value={currentItemValue}
              onChange={() => setValue(currentItemValue)}
              checked={isChecked}
              disabled={disabled}
              className='z-10 opacity-0 size-full absolute inset-0 cursor-pointer disabled:cursor-default rounded-full'
            />

            {children}
          </div>
        );
      })}
    </div>
  );
}
