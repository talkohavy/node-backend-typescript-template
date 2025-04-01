import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = PropsWithChildren<{
  onClick: () => void;
  className?: string;
}>;

export default function Button(props: ButtonProps) {
  const { children, onClick, className } = props;

  return (
    <button
      type='button'
      onClick={onClick}
      className={twMerge('rounded-md hover:rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-500 p-3', className)}
    >
      {children}
    </button>
  );
}
