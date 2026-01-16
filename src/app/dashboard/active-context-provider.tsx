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

interface ProviderState {
  activeContext: ActiveContextType | null;
  isReady: boolean;
}

interface ActiveContextProps extends ProviderState {
  setActiveContext: (context: ActiveContextType) => void;
  soloContext: ActiveContextType | null;
  borrowersQuery: Query<DocumentData> | null;
}

const ActiveContext = createContext<ActiveContextProps | undefined>(undefined);


// --- Provider Implementation ---

export const ActiveContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Use a single state object for atomic updates
  const [providerState, setProviderState] = useState<ProviderState>({
    activeContext: null,
    isReady: false,
  });

  // Extract primitive userId for stable dependencies
  const userId = user?.uid || null;

  // This effect now ONLY depends on primitive, stable values.
  // It is the heart of the Zero-Churn architecture.
  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until Firebase has determined the auth state.
    }

    if (userId) {
      // User is logged in. Create the initial solo context.
      const newSoloContext: ActiveContextType = {
        id: userId,
        type: 'solo',
        label: 'Solo Lender',
        icon: UserIcon,
      };
      
      // Atomic update: Set context and readiness in a single operation.
      // This runs only when the user's auth state truly changes.
      setProviderState(prevState => {
         // Only set the initial context if one isn't already active.
         // This preserves a user's selected group context across hot-reloads.
        if (!prevState.activeContext) {
             return { activeContext: newSoloContext, isReady: true };
        }
        return { ...prevState, isReady: true };
      });

    } else {
      // No user is logged in. Auth check is complete.
      setProviderState({ activeContext: null, isReady: true });
    }
  }, [userId, isUserLoading]);


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
    setProviderState(prevState => ({ ...prevState, activeContext: context }));
  };

  // --- Authorized Data Stream (The "Dead-Bolt") ---
  const { activeContext, isReady } = providerState;
  const borrowersQuery = useMemoFirebase(() => {
    const contextId = activeContext?.id;

    // Guard: Do not create a query until initialization is complete AND context ID is valid.
    // The query is memoized based on the primitive `contextId` string, ensuring stability.
    if (!isReady || !contextId || !firestore) {
      return null;
    }
    
    return query(collection(firestore, 'borrowers'), where('contextId', '==', contextId));
  }, [firestore, isReady, activeContext?.id]);


  const value = useMemo(() => ({
    ...providerState,
    setActiveContext,
    soloContext,
    borrowersQuery,
  }), [providerState, soloContext, borrowersQuery]);


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
