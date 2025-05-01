import { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../client/src/components/layout/main-layout';

export default function Home() {
  const router = useRouter();
  
  // Redirect to dashboard on initial load
  useEffect(() => {
    router.push('/dashboard');
  }, []);
  
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </MainLayout>
  );
}