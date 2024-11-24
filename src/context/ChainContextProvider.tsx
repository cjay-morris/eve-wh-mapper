'use client'

import React, { createContext, useState, useContext, type FC, useEffect } from 'react';
import { useSession } from "next-auth/react"
import { getLocation } from "../helpers/apiHelpers"

export interface LocationData {
  id: number;
  label: string;
  title: string;
}

export interface ChainContextType {
  currentLocation: string | null;
}

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export const useChainContext = () => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error('useChainContext must be used within a ChainProvider');
  }
  return context;
};

export const ChainProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<string | null>("Sooma");
  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      const location = await getLocation(session)
      setCurrentLocation(location ?? "Sooma")
    }
  
    const interval = setInterval(() => {
      if (session) {
        void fetchData()
      }
    }, 30000)

      return () => clearInterval(interval)
  })

  const contextValue = {
    currentLocation,
  };

  return (
    <ChainContext.Provider value={contextValue}>{children}</ChainContext.Provider>
  );
};
