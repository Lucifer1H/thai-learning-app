'use client';

import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [user] = useState<any | null>(null);
  const [loading] = useState(false);

  const signOut = async () => {
    // Will be implemented when Supabase is configured
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
