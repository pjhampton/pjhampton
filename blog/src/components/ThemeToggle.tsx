import { memo } from 'preact/compat';
import { SunIcon, MoonIcon } from './Icons';
import { useTheme } from '../utils/theme';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="p-2 transition duration-500 ease-in-out rounded-full">
      {resolvedTheme === 'dark' ? (
        <SunIcon
          onClick={() => setTheme('light')}
          className="text-2xl text-orange-400 cursor-pointer"
        />
      ) : (
        <MoonIcon
          onClick={() => setTheme('dark')}
          className="text-2xl text-gray-500 cursor-pointer"
        />
      )}
    </div>
  );
};

export default memo(ThemeToggle);
