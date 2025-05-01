import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../client/src/contexts/ThemeContext';
import { queryClient } from '../client/src/lib/queryClient';
import MainLayout from '../client/src/components/layout/main-layout';
import '../client/src/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}