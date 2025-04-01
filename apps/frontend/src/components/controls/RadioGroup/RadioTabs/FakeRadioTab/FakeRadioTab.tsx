type FakeRadioTabProps = {
  label: string;
};

export default function FakeRadioTab(props: FakeRadioTabProps) {
  const { label } = props;

  return (
    <div className='flex justify-center items-center relative bg-neutral-500 group-has-[input:checked]/radioWrapper:bg-blue-500 group-has-[input:focus:not(:checked)]/radioWrapper:border-blue-400 group-has-[input:focus:not(:checked)]/radioWrapper:bg-slate-300 group-has-[input:hover:not(:disabled)]/radioWrapper:bg-blue-400 group-has-[input:disabled]/radioWrapper:bg-neutral-400 group-has-[input:disabled]/radioWrapper:opacity-40 h-8 w-32 rounded-t-md cursor-pointer'>
      {label}
    </div>
  );
}
