import clsx from 'clsx';
import styles from './Toggle.module.scss';

type ToggleProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  className?: string;
};

export default function Toggle(props: ToggleProps) {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <label className={clsx(styles.switch, className)}>
      <input type='checkbox' checked={isChecked} onChange={setIsChecked} disabled={disabled} />
      <span className={styles.radioButtonBg}>
        <div className={styles.slider} />
      </span>
    </label>
  );
}
