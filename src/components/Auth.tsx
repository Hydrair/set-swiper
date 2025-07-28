'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export default function Auth() {
  const { data: session, status } = useSession();
  const { setUserId, clearUserData } = useAppStore();

  useEffect(() => {
    if (session?.user && (session.user as any).id) {
      setUserId((session.user as any).id);
    } else if (status === 'unauthenticated') {
      setUserId(null);
      clearUserData();
    }
  }, [session, status, setUserId, clearUserData]);

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => signIn()}
        className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <LogIn className="w-4 h-4 mr-1" />
        Sign In
      </button>
    </div>
  );
} 