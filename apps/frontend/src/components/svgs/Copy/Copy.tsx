type CopyProps = {
  className?: string;
};

export default function Copy(props: CopyProps) {
  const { className } = props;

  return (
    <svg
      viewBox='-2.4 -2.4 19.5 21.5'
      fill='currentColor'
      fillRule='evenodd'
      transform='matrix(-1, 0, 0, 1, 0, 0)rotate(0)'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path d='m10.35-2.4h-4.0564c-1.8378-2e-5 -3.2934-3e-5 -4.4326 0.15314-1.1724 0.15762-2.1214 0.48974-2.8697 1.2381-0.74836 0.74837-1.0805 1.6973-1.2381 2.8697-0.15317 1.1392-0.15316 2.5948-0.15314 4.4326v6.0564c0 1.8722 1.372 3.424 3.1655 3.7047 0.13797 0.764 0.40202 1.4161 0.93284 1.947 0.60192 0.6019 1.3598 0.8608 2.2599 0.9818 0.86697 0.1165 1.9692 0.1165 3.3368 0.1165h3.1098c1.3676 0 2.4699 0 3.3369-0.1165 0.9001-0.121 1.6579-0.3799 2.2599-0.9818 0.6019-0.602 0.8608-1.3598 0.9818-2.2599 0.1165-0.867 0.1165-1.9693 0.1165-3.3369v-5.1098c0-1.3676 0-2.4699-0.1165-3.3368-0.121-0.90011-0.3799-1.658-0.9818-2.2599-0.5309-0.53082-1.183-0.79487-1.947-0.93284-0.2807-1.7935-1.8325-3.1655-3.7047-3.1655zm2.1293 3.0212c-0.3028-0.88494-1.1417-1.5212-2.1293-1.5212h-4c-1.9068 0-3.2615 0.00159-4.2892 0.13976-1.0061 0.13526-1.5857 0.38893-2.009 0.81214s-0.67688 1.0029-0.81214 2.009c-0.13817 1.0277-0.13976 2.3823-0.13976 4.2892v6c0 0.9876 0.63624 1.8265 1.5212 2.1293-0.02119-0.6099-0.02118-1.2996-0.02117-2.0744v-5.1098c-2e-5 -1.3676-4e-5 -2.4699 0.11652-3.3368 0.12102-0.90011 0.37991-1.658 0.98183-2.2599s1.3598-0.86081 2.2599-0.98183c0.86697-0.11656 1.9692-0.11654 3.3368-0.11652h3.1098c0.7748-1e-5 1.4645-2e-5 2.0744 0.02117zm-9.7203 2.1378c0.27676-0.27676 0.66534-0.45721 1.3991-0.55586 0.75535-0.10156 1.7565-0.10315 3.1919-0.10315h3c1.4354 0 2.4365 0.00159 3.1919 0.10315 0.7338 0.09865 1.1223 0.2791 1.3991 0.55586s0.4572 0.66534 0.5559 1.3991c0.1015 0.75535 0.1031 1.7565 0.1031 3.1919v5c0 1.4354-0.0016 2.4365-0.1031 3.1919-0.0987 0.7338-0.2791 1.1223-0.5559 1.3991s-0.6653 0.4572-1.3991 0.5559c-0.7554 0.1015-1.7565 0.1031-3.1919 0.1031h-3c-1.4354 0-2.4365-0.0016-3.1919-0.1031-0.73377-0.0987-1.1224-0.2791-1.3991-0.5559s-0.45721-0.6653-0.55586-1.3991c-0.10156-0.7554-0.10315-1.7565-0.10315-3.1919v-5c0-1.4354 0.00159-2.4365 0.10315-3.1919 0.09865-0.73377 0.2791-1.1224 0.55586-1.3991z' />
    </svg>
  );
}
