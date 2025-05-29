import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { supabase } from '../../lib/supabase';

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

export const MapComponent: React.FC<MapComponentProps> = ({ isDarkMode }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [pois, setPois] = useState<POIData[]>([]);

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

      const formattedData = data.map(poi => ({
        id: poi.id,
        name: poi.name,
        latitude: poi.latitude,
        longitude: poi.longitude,
        type_id: poi.type_id,
        type_name: poi.poi_types.name,
        type_color: poi.poi_types.color
      }));

      setPois(formattedData);
    } catch (error) {
      console.error('Error fetching POIs:', error);
    }
  };

  useEffect(() => {
    fetchPOIs();

    // Subscribe to changes
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
    new ScatterplotLayer({
      id: 'poi-layer',
      data: pois,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 3,
      radiusMaxPixels: 30,
      lineWidthMinPixels: 1,
      getPosition: d => [d.longitude, d.latitude],
      getFillColor: d => {
        const color = d.type_color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)?.[0] || '#000000';
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return [r, g, b, 255];
      },
      getLineColor: [0, 0, 0],
      getRadius: 5,
      onHover: ({ object }) => {
        if (object) {
          // You can implement tooltip or hover effects here
          console.log(`Hovering over ${object.name} (${object.type_name})`);
        }
      }
    })
  ];

  return (
    <div className="relative w-full h-full">
      <DeckGL
        initialViewState={viewState}
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