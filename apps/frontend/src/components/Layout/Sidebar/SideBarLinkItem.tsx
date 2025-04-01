import clsx from 'clsx';
import { Link } from 'react-router';

type SideBarLinkItemProps = {
  to: string;
  text: string;
  isActive?: boolean;
};

export default function SideBarLinkItem(props: SideBarLinkItemProps) {
  const { to, text, isActive } = props;

  return (
    <Link to={to} className={clsx('text-lg hover:text-red-500 active:text-red-400', isActive && 'font-medium')}>
      {text}
    </Link>
  );
}
