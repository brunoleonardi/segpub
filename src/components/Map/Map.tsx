import React, { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
import DeckGL from '@deck.gl/react';
import { IconLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { supabase } from '../../lib/supabase';
import { useMapContext } from '../../contexts/MapContext';
import { useTheme } from '../../contexts/ThemeContext';

const MAPBOX_STYLE_DARK = 'mapbox://styles/geovista-fdte/clu7c9nmj00vs01pad3m97qqa';
const MAPBOX_STYLE_LIGHT = 'mapbox://styles/geovista-fdte/clon6qm3o008t01peeqk31rg7';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ2VvdmlzdGEtZmR0ZSIsImEiOiJja3plOG9wM2UzNmdkMnZuZnkzdHhrY3N1In0.8FxWCItNfns7J7hXCt-tFQ';

const ICON_MAPPING = {
  marker: { x: 0, y: -0, width: 26, height: 26, mask: true }
};

interface POIData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type_id: string;
  type_name: string;
  type_color: string;
}

const isValidCoordinate = (poi: any): poi is POIData => {
  return (
    typeof poi.latitude === 'number' &&
    typeof poi.longitude === 'number' &&
    !isNaN(poi.latitude) &&
    !isNaN(poi.longitude) &&
    poi.latitude >= -90 &&
    poi.latitude <= 90 &&
    poi.longitude >= -180 &&
    poi.longitude <= 180
  );
};

export const MapComponent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [pois, setPois] = useState<POIData[]>([]);
  const {
    setZoomToLocation,
    hiddenPOITypes,
    viewState,
    setViewState,
    fitToAllLayers,
    deckRef
  } = useMapContext();

  useEffect(() => {
    if (pois.length > 0) {
      setTimeout(() => {
        forceToCenter();
        setTimeout(() => {
          forceToCenter();
        }, 200);
      }, 500);
    }
  }, [pois]);

  const fetchPOIs = async () => {
    const { data, error } = await supabase
      .from('pois')
      .select(`
        id,
        name,
        latitude,
        longitude,
        type_id,
        poi_types (
          name,
          color
        )
      `);
    if (error) return;

    const formattedData = data
      .map(poi => ({
        id: poi.id,
        name: poi.name,
        latitude: Number(poi.latitude),
        longitude: Number(poi.longitude),
        type_id: poi.type_id,
        type_name: poi.poi_types.name,
        type_color: poi.poi_types.color
      }))
      .filter(isValidCoordinate);

    setPois(formattedData);
  };

  const updateMapLocation = useCallback((latitude: number, longitude: number) => {
    setViewState(prev => ({
      ...prev,
      latitude,
      longitude,
      zoom: 16,
      transitionDuration: 1500
    }));
  }, [setViewState]);

  useEffect(() => {
    setZoomToLocation(() => updateMapLocation);
  }, [setZoomToLocation, updateMapLocation]);

  useEffect(() => {
    fetchPOIs();
    const channel = supabase
      .channel('poi_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pois' },
        fetchPOIs
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const layers = [
    new IconLayer({
      id: 'poi-layer',
      data: pois.filter(poi => !hiddenPOITypes.has(poi.type_id)),
      pickable: true,
      iconAtlas: '/map-pin.svg',
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 2,
      getPosition: d => [d.longitude, d.latitude],
      getSize: d => 8,
      getColor: d => {
        const hex = d.type_color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)?.[0] || '#000000';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b, 255];
      }
    })
  ];

  const handleCentralizeAll = () => {
    fitToAllLayers();
  };

  return (
    <div className="relative w-full h-full" onContextMenu={(e) => e.preventDefault()}>
      <DeckGL
        ref={deckRef}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={isDarkMode ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT}
          reuseMaps
          attributionControl={false}
        />
      </DeckGL>
      <button
        id='centerButton'
        className="display-none"
        onClick={handleCentralizeAll}
      />
    </div>
  );
};

export const forceToCenter = () => {
  document.getElementById('centerButton')?.click();
}