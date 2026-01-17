'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { User as UserIcon, LucideIcon } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { query, collection, where, Query, DocumentData } from 'firebase/firestore';

// --- State and Type Definitions ---

export interface ActiveContextType {
  id: string;
  type: 'solo' | 'group';
  label: string;
  icon: LucideIcon;
}

interface ActiveContextProps {
  activeContext: ActiveContextType | null;
  setActiveContext: (context: ActiveContextType) => void;
  soloContext: ActiveContextType | null;
  borrowersQuery: Query<DocumentData> | null;
  loansQuery: Query<DocumentData> | null;
  ledgerQuery: Query<DocumentData> | null;
}

const ActiveContext = createContext<ActiveContextProps | undefined>(undefined);


// --- Provider Implementation ---

export const ActiveContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading } = useUser();
  const authResolved = !isUserLoading && !!user;
  const firestore = useFirestore();
  const [activeContext, setActiveContextState] = useState<ActiveContextType | null>(null);

  // Extract primitive userId for stable dependencies
  const userId = user?.uid || null;

  // This effect sets the initial solo context once the user is loaded.
  useEffect(() => {
    if (!isUserLoading && userId && !activeContext) {
      const newSoloContext: ActiveContextType = {
        id: userId,
        type: 'solo',
        label: 'Solo Lender',
        icon: UserIcon,
      };
      setActiveContextState(newSoloContext);
    } else if (!userId) {
      setActiveContextState(null);
    }
  }, [userId, isUserLoading, activeContext]);


  const soloContext = useMemo<ActiveContextType | null>(() => {
    if (!userId) return null;
    return {
      id: userId,
      type: 'solo',
      label: 'Solo Lender',
      icon: UserIcon,
    };
  }, [userId]);


  // Manual context setting for the switcher
  const setActiveContext = (context: ActiveContextType) => {
    setActiveContextState(context);
  };

  // --- Hard-Anchored Architecture ---
  // All queries are anchored directly to the primitive `userId`.
  // They are guaranteed to be null until the user ID is available.

  const borrowersQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    const q = query(collection(firestore, 'borrowers'), where('contextId', '==', userId));
    (q as any).__authResolved = authResolved;
    return q;
  }, [firestore, userId, authResolved]);

  const loansQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    const q = query(collection(firestore, 'loans'), where('contextId', '==', userId));
    (q as any).__authResolved = authResolved;
    return q;
  }, [firestore, userId, authResolved]);

  const ledgerQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    const q = query(collection(firestore, 'ledger'), where('contextId', '==', userId));
    (q as any).__authResolved = authResolved;
    return q;
  }, [firestore, userId, authResolved]);


  const value = useMemo(() => ({
    activeContext,
    setActiveContext,
    soloContext,
    borrowersQuery,
    loansQuery,
    ledgerQuery,
  }), [activeContext, soloContext, borrowersQuery, loansQuery, ledgerQuery]);


  return (
    <ActiveContext.Provider value={value}>
      {children}
    </ActiveContext.Provider>
  );
};


// --- Hook for consuming the context ---

export const useActiveContext = () => {
  const context = useContext(ActiveContext);
  if (context === undefined) {
    throw new Error('useActiveContext must be used within an ActiveContextProvider');
  }
  return context;
};
