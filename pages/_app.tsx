import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../client/src/contexts/ThemeContext';
import { queryClient } from '../client/src/lib/queryClient';
import MainLayout from '../client/src/components/layout/main-layout';
import '../client/src/index.css';
import Head from 'next/head';

// This ensures dark mode is detected and applied before the first render
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // Check if dark mode is stored in localStorage
              const darkModeStored = localStorage.getItem('theme');
              if (darkModeStored === 'dark') {
                document.documentElement.classList.add('dark');
              } else if (!darkModeStored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // Check system preference if no stored preference
                document.documentElement.classList.add('dark');
              }
            } catch (e) {
              // Handle any localStorage errors that might occur
              console.error('Error accessing localStorage:', e);
            }
          })();
        `,
      }}
    />
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeScript />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}