import { useDarkTheme } from '../../../../providers/DarkThemeProvider/DarkThemeContext';
import Toggle from '../../../controls/Toggle';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkTheme();

  return <Toggle isChecked={isDarkMode} setIsChecked={toggleDarkMode} />;
}
