'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to sign-in page which will show Clerk's interface
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Show loading state while redirecting
  if (!isSignedIn) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-gray-400">Redirecting to sign in...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}