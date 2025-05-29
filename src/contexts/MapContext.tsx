import React, { createContext, useContext, useState, useCallback } from 'react';

interface MapContextType {
  zoomToLocation: (latitude: number, longitude: number) => void;
  setZoomToLocation: React.Dispatch<React.SetStateAction<(latitude: number, longitude: number) => void>>;
  hiddenPOITypes: Set<string>;
  togglePOIType: (typeId: string) => void;
}

const defaultZoomFunction = (latitude: number, longitude: number) => {};

const MapContext = createContext<MapContextType>({
  zoomToLocation: defaultZoomFunction,
  setZoomToLocation: () => defaultZoomFunction,
  hiddenPOITypes: new Set(),
  togglePOIType: () => {},
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomToLocation, setZoomToLocation] = useState<(latitude: number, longitude: number) => void>(() => defaultZoomFunction);
  const [hiddenPOITypes, setHiddenPOITypes] = useState<Set<string>>(new Set());

  const togglePOIType = useCallback((typeId: string) => {
    setHiddenPOITypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(typeId)) {
        newSet.delete(typeId);
      } else {
        newSet.add(typeId);
      }
      return newSet;
    });
  }, []);

  return (
    <MapContext.Provider value={{ zoomToLocation, setZoomToLocation, hiddenPOITypes, togglePOIType }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);