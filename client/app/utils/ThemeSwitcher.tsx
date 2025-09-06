'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center justify-center mx-4'>
        <div className='w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse'></div>
      </div>
    );
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    console.log('Switching theme from', resolvedTheme, 'to', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className='flex items-center justify-center mx-4'>
      <button
        onClick={toggleTheme}
        className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200'
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <BiSun
            className='text-yellow-500'
            size={20}
          />
        ) : (
          <BiMoon
            className='text-gray-700'
            size={20}
          />
        )}
      </button>
    </div>
  );
};
