import React, { createContext, useContext, useState } from 'react';

interface MapContextType {
  zoomToLocation: (latitude: number, longitude: number) => void;
  setZoomToLocation: (callback: (latitude: number, longitude: number) => void) => void;
}

const MapContext = createContext<MapContextType>({
  zoomToLocation: () => {},
  setZoomToLocation: () => {},
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomToLocation, setZoomToLocation] = useState<(latitude: number, longitude: number) => void>(() => () => {});

  return (
    <MapContext.Provider value={{ zoomToLocation, setZoomToLocation }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);