import clsx from 'clsx';
import { SelectOption } from './types';

type SelectProps = {
  selectedOption: SelectOption;
  setOption: (value: SelectOption) => void;
  options: Array<SelectOption>;
  className?: string;
};

export default function Select(props: SelectProps) {
  const { selectedOption, setOption, options, className } = props;

  return (
    <select
      value={selectedOption.value}
      onChange={(e) => {
        const selectedValue = e.target.value;
        const selectedOption = options.find((option) => option.value.toString() === selectedValue.toString());

        if (!selectedOption) throw new Error("could not find `selectedValue` inside of Select's options array");

        setOption(selectedOption);
      }}
      className={clsx(
        'h-8 cursor-pointer rounded-md border p-1 hover:border-blue-400 focus:border-blue-600 dark:bg-slate-900',
        className,
      )}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
