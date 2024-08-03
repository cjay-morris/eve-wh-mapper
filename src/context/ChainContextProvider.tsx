'use client'

import React, { createContext, useState, useContext, type FC, useEffect } from 'react';
import { useSession } from "next-auth/react"
import { getLocation } from "../helpers/apiHelpers"
import { linkAlreadyExists } from '~/helpers/linkAlreadyExists';
import { removeLink } from '~/helpers/removeLink';

export interface LocationData {
  id: number;
  label: string;
  title: string;
}

export interface LinkData {
  from: number;
  to: number;
}

export interface ChainContextType {
  currentLocation: string | null;
  locations: LocationData[];
  links: LinkData[];
  removeLocation: (id: number) => void;
  clearLocations: () => void;
  deleteLink: (link: { from: number, to: number }) => void;
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
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [lastLocation, setLastLocation] = useState<string | null>(null);
  const { data: session } = useSession()

  // trigger when currentLocation changes
  // const addLocation
  useEffect(() => {
    if (!currentLocation || currentLocation === lastLocation || locations.find((location) => location.label === currentLocation)) {
      return;
    }
    console.log("Adding location", currentLocation)
    setLocations([...locations, { id: locations.length + 1, label: currentLocation, title: currentLocation }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const removeLocation = (id: number) => {
    setLocations(locations.filter((location) => location.id !== id));
  };

  const clearLocations = () => {
    setLocations([]);
  }

  const getIdFromLabel = (label: string) => {
    const location = locations.find((location) => location.label === label);
    if (!location) {
      return null;
    }
    return location.id
  }

  useEffect(() => {
    // if link already exists, don't add it
    if (!currentLocation || !lastLocation) {
      console.log("No location")
      return;
    }
    const from = getIdFromLabel(lastLocation)
    const to = getIdFromLabel(currentLocation)
    if (!from || !to) {
      console.log("No from or to", from, to)
      return
    }
    if (lastLocation === currentLocation || linkAlreadyExists(links, { from: from, to: to })) {
      console.log("Link already exists")
      return;
    }
    console.log("Adding link from", lastLocation, "to", currentLocation)
    setLinks([...links, { from: from, to: to }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, currentLocation]);

  const deleteLink = (link: { from: number, to: number }) => {
    setLinks(removeLink(links, link))
  };

    useEffect(() => {
        const fetchData = async () => {
            const location = await getLocation(session)
            setLastLocation(currentLocation)
            setCurrentLocation(location)
            console.log("Location: ", currentLocation)
            console.log("Locations: ", locations)
            console.log("Links: ", links.map((link) => {
              return { from: link.from, to: link.to }
        }))
        }
        const interval = setInterval(() => {
            if (session) {
               void fetchData()
            }
        }, 5000)

        return () => clearInterval(interval)
    })

  const contextValue = {
    currentLocation,
    locations,
    links,
    removeLocation,
    clearLocations,
    deleteLink,
  };

  return (
    <ChainContext.Provider value={contextValue}>{children}</ChainContext.Provider>
  );
};
