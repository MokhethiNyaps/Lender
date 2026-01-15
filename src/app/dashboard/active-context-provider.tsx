'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Users, LucideIcon } from 'lucide-react';

export interface ActiveContextType {
  id: string | null;
  type: 'solo' | 'group';
  label: string;
  icon: LucideIcon;
}

export const soloContext: ActiveContextType = {
  id: 'solo',
  type: 'solo',
  label: 'Solo Lender',
  icon: User,
};

interface ActiveContextProps {
  activeContext: ActiveContextType;
  setActiveContext: (context: ActiveContextType) => void;
}

const ActiveContext = createContext<ActiveContextProps | undefined>(undefined);

export const ActiveContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeContext, setActiveContext] = useState<ActiveContextType>(soloContext);

  return (
    <ActiveContext.Provider value={{ activeContext, setActiveContext }}>
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
