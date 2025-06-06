import React, { createContext, useContext, useState, useCallback } from 'react';
import deckRef from './DeckRef';
import { point, featureCollection, bbox, center as turfCenter } from '@turf/turf';

interface MapContextType {
  zoomToLocation: (latitude: number, longitude: number, zoom: number) => void;
  hiddenPOITypes: Set<string>;
  togglePOIType: (typeId: string) => void;
  fitToCoordinates: (coords: [number, number][]) => void;
  fitToAllLayers: () => void;
  viewState: any;
  setViewState: React.Dispatch<React.SetStateAction<any>>;
  deckRef: React.MutableRefObject<any>;
  selectedPOI: any
  setSelectedPOI: (selected: any) => void;
}

interface POIData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type_id: string;
  type_name: string;
  type_color: string;
}

const INITIAL_VIEW_STATE = {
  longitude: -46.6388,
  latitude: -23.5489,
  zoom: 12,
  pitch: 0,
  bearing: 0
};

const defaultZoomFunction = (latitude: number, longitude: number, zoom?: number) => { };

const MapContext = createContext<MapContextType>({
  zoomToLocation: defaultZoomFunction,
  hiddenPOITypes: new Set(),
  togglePOIType: () => { },
  fitToCoordinates: () => { },
  fitToAllLayers: () => { },
  viewState: INITIAL_VIEW_STATE,
  setViewState: () => { },
  deckRef: { current: null },
  selectedPOI: [],
  setSelectedPOI: () => [],
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hiddenPOITypes, setHiddenPOITypes] = useState<Set<string>>(new Set());
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);

  const zoomToLocation = useCallback((latitude: number, longitude: number, zoom: number = 16) => {
    setViewState(prev => ({
      ...prev,
      latitude,
      longitude,
      zoom,
      transitionDuration: 1000
    }));
  }, [setViewState]);

  const fitToAllLayers = useCallback(() => {
    const layers = deckRef.current?.deck?.layerManager?.layers || [];
    const points = [];

    layers.forEach(layer => {
      const data = layer?.props?.data;
      const getPosition = layer?.props?.getPosition;

      if (Array.isArray(data) && typeof getPosition === 'function') {
        data.forEach((item: any) => {
          const pos = getPosition(item);
          if (Array.isArray(pos) && pos.length === 2) {
            points.push(point(pos));
          }
        });
      }
    });

    if (points.length === 0) {
      console.warn('⚠️ No points to center.');
      return;
    }

    const features = featureCollection(points);
    const [minLng, minLat, maxLng, maxLat] = bbox(features);
    const [centerLng, centerLat] = turfCenter(features).geometry.coordinates;

    const WORLD_DIM = { height: window.innerHeight, width: window.innerWidth };
    const ZOOM_MAX = 22;

    const latRad = (lat: number) => {
      const sin = Math.sin((lat * Math.PI) / 180);
      return Math.log((1 + sin) / (1 - sin)) / 2;
    };

    const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;
    const lngDiff = maxLng - minLng;
    const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

    const latZoom = Math.log2(WORLD_DIM.height / 256 / latFraction);
    const lngZoom = Math.log2(WORLD_DIM.width / 256 / lngFraction);
    let zoom = Math.min(ZOOM_MAX, Math.floor(Math.min(latZoom, lngZoom)));

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      zoom = Math.max(zoom - 1, 3);
    }

    setViewState(prev => ({
      ...prev,
      latitude: centerLat,
      longitude: centerLng,
      zoom,
      transitionDuration: 1000
    }));
  }, []);

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
      hiddenPOITypes,
      togglePOIType,
      fitToCoordinates: () => { },
      fitToAllLayers,
      viewState,
      setViewState,
      deckRef,
      selectedPOI,
      setSelectedPOI
    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);