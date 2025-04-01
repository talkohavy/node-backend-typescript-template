type DownArrowProps = {
  title?: string;
  className?: string;
};

export default function DownArrow(props: DownArrowProps) {
  const { title = 'arrow icon', className } = props;

  return (
    <svg stroke='currentColor' strokeWidth='12' viewBox='0 0 100 100' className={className}>
      <title>{title}</title>
      <line x1='10' y1='30' x2='50' y2='68' strokeLinecap='round' />
      <line x1='50' y1='68' x2='90' y2='30' strokeLinecap='round' />
    </svg>
  );
}
