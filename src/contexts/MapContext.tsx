import React, { createContext, useContext, useState } from 'react';

interface MapContextType {
  zoomToLocation: (latitude: number, longitude: number) => void;
  setZoomToLocation: React.Dispatch<React.SetStateAction<(latitude: number, longitude: number) => void>>;
}

const defaultZoomFunction = (latitude: number, longitude: number) => {};

const MapContext = createContext<MapContextType>({
  zoomToLocation: defaultZoomFunction,
  setZoomToLocation: () => defaultZoomFunction,
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomToLocation, setZoomToLocation] = useState<(latitude: number, longitude: number) => void>(() => defaultZoomFunction);

  return (
    <MapContext.Provider value={{ zoomToLocation, setZoomToLocation }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);