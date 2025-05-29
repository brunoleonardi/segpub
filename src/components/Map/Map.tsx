import React, { useState, useEffect, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { IconLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { supabase } from '../../lib/supabase';
import { useMapContext } from '../../contexts/MapContext';

const MAPBOX_STYLE_DARK = 'mapbox://styles/geovista-fdte/clu7c9nmj00vs01pad3m97qqa';
const MAPBOX_STYLE_LIGHT = 'mapbox://styles/geovista-fdte/clon6qm3o008t01peeqk31rg7';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ2VvdmlzdGEtZmR0ZSIsImEiOiJja3plOG9wM2UzNmdkMnZuZnkzdHhrY3N1In0.8FxWCItNfns7J7hXCt-tFQ';

const INITIAL_VIEW_STATE = {
  longitude: -46.6388,
  latitude: -23.5489,
  zoom: 12,
  pitch: 0,
  bearing: 0
};

const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

interface MapComponentProps {
  isDarkMode: boolean;
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

export const MapComponent: React.FC<MapComponentProps> = ({ isDarkMode }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [pois, setPois] = useState<POIData[]>([]);
  const { setZoomToLocation } = useMapContext();

  const fetchPOIs = async () => {
    try {
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

      if (error) throw error;

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
    } catch (error) {
      console.error('Error fetching POIs:', error);
    }
  };

  const updateMapLocation = useCallback((latitude: number, longitude: number) => {
    if (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      setViewState(prevState => ({
        ...prevState,
        latitude,
        longitude,
        zoom: 16,
        transitionDuration: 2000,
      }));
    }
  }, []);

  useEffect(() => {
    setZoomToLocation(() => updateMapLocation);
  }, [setZoomToLocation, updateMapLocation]);

  useEffect(() => {
    fetchPOIs();

    const channel = supabase
      .channel('poi_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pois'
        },
        () => {
          fetchPOIs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const layers = [
    new IconLayer({
      id: 'poi-layer',
      data: pois,
      pickable: true,
      iconAtlas: '/map-pin.svg',
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 45,
      getPosition: d => [d.longitude, d.latitude],
      getSize: d => 5,
      getColor: d => {
        const color = d.type_color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)?.[0] || '#000000';
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return [r, g, b, 255];
      },
      onHover: ({ object }) => {
        if (object) {
          console.log(`Hovering over ${object.name} (${object.type_name})`);
        }
      }
    })
  ];

  return (
    <div className="relative w-full h-full">
      <DeckGL
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
      <div className={`absolute bottom-0 right-0 p-2 z-10 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        © <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">Mapbox</a> |
        © <a href="https://www.openstreetmap.org/about/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> |
        <a href="https://www.mapbox.com/map-feedback/" target="_blank" rel="noopener noreferrer">Improve this map</a>
      </div>
    </div>
  );
};