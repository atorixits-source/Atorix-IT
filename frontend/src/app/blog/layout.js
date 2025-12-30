'use client';

import { ThemeProvider } from 'next-themes';

export default function BlogLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        {children}
      </div>
    </ThemeProvider>
  );
}
