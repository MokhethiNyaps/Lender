'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { User as UserIcon, LucideIcon } from 'lucide-react';
import { useUser } from '@/firebase';

export interface ActiveContextType {
  id: string;
  type: 'solo' | 'group';
  label: string;
  icon: LucideIcon;
}

interface ActiveContextProps {
  activeContext: ActiveContextType | null;
  setActiveContext: (context: ActiveContextType) => void;
  isReady: boolean;
  soloContext: ActiveContextType | null;
}

const ActiveContext = createContext<ActiveContextProps | undefined>(undefined);

export const ActiveContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading } = useUser();
  const [activeContext, setActiveContext] = useState<ActiveContextType | null>(null);
  const [isReady, setIsReady] = useState(false);

  const soloContext = useMemo<ActiveContextType | null>(() => {
    if (!user) return null;
    return {
      id: user.uid,
      type: 'solo',
      label: 'Solo Lender',
      icon: UserIcon,
    };
  }, [user]);

  useEffect(() => {
    if (!isUserLoading) {
      if (user && soloContext) {
        // If there's no active context set yet, default to solo context.
        if (!activeContext) {
            setActiveContext(soloContext);
        }
      } else {
         // User logged out
         setActiveContext(null);
      }
      // Mark as ready once auth state is confirmed.
      setIsReady(true);
    }
  }, [user, isUserLoading, activeContext, soloContext]);


  return (
    <ActiveContext.Provider value={{ activeContext, setActiveContext, isReady, soloContext }}>
      {children}
    </ActiveContext.Provider>
  );
};

export const useActiveContext = () => {
  const context = useContext(ActiveContext);
  if (context === undefined) {
    throw new Error('useActiveContext must be used within an ActiveContextProvider');
  }
  return context;
};
