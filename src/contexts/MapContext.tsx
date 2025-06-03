import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import deckRef from './DeckRef';
import bbox from '@turf/bbox';
import { FeatureCollection, Point } from 'geojson';
import { fitBounds } from '@deck.gl/core'; // opcional, para calcular zoom

interface MapContextType {
  zoomToLocation: (latitude: number, longitude: number) => void;
  setZoomToLocation: React.Dispatch<React.SetStateAction<(latitude: number, longitude: number) => void>>;
  hiddenPOITypes: Set<string>;
  togglePOIType: (typeId: string) => void;
  fitToCoordinates: (coords: [number, number][]) => void;
  fitToAllLayers: (layers: any[]) => void;
  viewState: any;
  setViewState: React.Dispatch<React.SetStateAction<any>>;
  deckRef: React.MutableRefObject<any>;
}

const INITIAL_VIEW_STATE = {
  longitude: -46.6388,
  latitude: -23.5489,
  zoom: 12,
  pitch: 0,
  bearing: 0
};
const defaultZoomFunction = (latitude: number, longitude: number) => { };

const MapContext = createContext<MapContextType>({
  zoomToLocation: defaultZoomFunction,
  setZoomToLocation: () => defaultZoomFunction,
  hiddenPOITypes: new Set(),
  togglePOIType: () => { },
  fitToCoordinates: () => { },
  fitToAllLayers: () => { },
  viewState: INITIAL_VIEW_STATE,
  setViewState: () => { },
  deckRef: { current: null },
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [zoomToLocation, setZoomToLocation] = useState<(lat: number, lon: number) => void>(() => () => { });
  const [hiddenPOITypes, setHiddenPOITypes] = useState<Set<string>>(new Set());

  const fitToAllLayers = useCallback(() => {
    const layers = deckRef.current?.deck?.layerManager?.layers || [];

    const allFeatures: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: []
    };

    layers.forEach(layer => {
      const data = layer?.props?.data;
      const getPosition = layer?.props?.getPosition;

      if (Array.isArray(data) && typeof getPosition === 'function') {
        data.forEach((item: any) => {
          const pos = getPosition(item);
          if (
            Array.isArray(pos) &&
            typeof pos[0] === 'number' &&
            typeof pos[1] === 'number'
          ) {
            allFeatures.features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: pos
              },
              properties: {}
            });
          }
        });
      }
    });

    if (allFeatures.features.length === 0) {
      console.warn("⚠️ Nenhum dado para centralizar.");
      return;
    }

    const [minLng, minLat, maxLng, maxLat] = bbox(allFeatures);

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    const deltaLng = maxLng - minLng;
    const deltaLat = maxLat - minLat;
    const maxDelta = Math.max(deltaLng, deltaLat);

    const screenWidth = window.innerWidth;
    let baseZoom = 14;
    if (screenWidth < 480) baseZoom = 12;
    else if (screenWidth < 768) baseZoom = 13;

    const zoomOffset = Math.log2(maxDelta / 0.01);
    const calculatedZoom = Math.max(10, Math.min(16, baseZoom - zoomOffset));

    setViewState(prev => ({
      ...prev,
      latitude: centerLat,
      longitude: centerLng,
      zoom: calculatedZoom,
      transitionDuration: 1000
    }));
  }, [deckRef, setViewState]);

  const togglePOIType = (typeId: string) => {
    setHiddenPOITypes(prev => {
      const newSet = new Set(prev);
      newSet.has(typeId) ? newSet.delete(typeId) : newSet.add(typeId);
      return newSet;
    });
  };

  return (
    <MapContext.Provider value={{
      zoomToLocation,
      setZoomToLocation,
      hiddenPOITypes,
      togglePOIType,
      fitToCoordinates: () => { },
      fitToAllLayers, // <-- agora não precisa passar layers
      viewState,
      setViewState,
      deckRef
    }}>
      {children}
    </MapContext.Provider>
  );
};


export const useMapContext = () => useContext(MapContext);