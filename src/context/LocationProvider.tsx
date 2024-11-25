'use client'

import React, { createContext, useState, useContext, useMemo, type FC, useEffect } from 'react';
import { useSession } from "next-auth/react"
import { getLocation } from "../helpers/apiHelpers"
import { type Signature } from '~/types/Signature';

export interface LocationContextType {
  currentLocation: string | null;
  locationData: { sigs?: Signature[] };
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a ChainProvider');
  }
  return context;
};

const fetchSignatures = async (system: string) => {
  const res = await fetch('/api/system?system=' + system)
  if (!res.ok) {
    console.log('Failed to fetch signatures:', res.statusText)
    return { sigs: [] }
  }
  return await res.json() as { sigs?: Signature[] }
}

export const ChainProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<string | null>("Unknown");
  const [locationData, setLocationData] = useState<{ sigs?: Signature[] }>({ sigs: [] });
  const { data: session } = useSession()

  // get signatures from DB on location change
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSignatures(currentLocation ?? "Unknown")
      setLocationData(data)
    }

    void fetchData()
  }
  , [currentLocation])

  // get location from EVE API every 30 seconds
  useEffect(() => {
    const fetchData = async () => {
      const location = await getLocation(session)
      setCurrentLocation(location ?? "Unknown")
    }
  
    const interval = setInterval(() => {
      if (session) {
        void fetchData()
      }
    }, 30000)

      return () => clearInterval(interval)
  }, [session])

    // get sigs from DB every 30 seconds
    useEffect(() => {
      const fetchData = async () => {
        if (currentLocation && currentLocation !== "Unknown") {
          const sigs = await fetchSignatures(currentLocation)
          setLocationData(sigs)
        }
      }
    
      const interval = setInterval(() => {
        if (session) {
          void fetchData()
        }
      }, 30000)
  
        return () => clearInterval(interval)
    }, [session])

  const contextValue = {
    currentLocation,
    locationData,
  };

  return (
    <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>
  );
};
