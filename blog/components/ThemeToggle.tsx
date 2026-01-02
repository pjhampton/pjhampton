import React from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="p-2 transition duration-500 ease-in-out rounded-full">
      {resolvedTheme === 'dark' ? (
        <FaSun
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="text-2xl text-orange-400 cursor-pointer react-icons"
        />
      ) : (
        <FaMoon
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="text-2xl text-gray-500 cursor-pointer react-icons"
        />
      )}
    </div>
  );
};

export default React.memo(ThemeToggle);
