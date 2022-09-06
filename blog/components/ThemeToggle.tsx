import { useTheme } from 'next-themes'
import { FaSun, FaMoon } from 'react-icons/fa'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className='p-2 transition duration-500 ease-in-out rounded-full'>
      {theme === 'dark' ? (
        <FaSun
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='text-2xl text-gray-500 cursor-pointer dark:text-gray-400'
        />
      ) : (
        <FaMoon
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='text-2xl text-gray-500 cursor-pointer dark:text-gray-400'
        />
      )}
    </div>
  );
}

export default ThemeToggle
