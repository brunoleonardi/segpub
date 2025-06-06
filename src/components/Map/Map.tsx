import React, { useState, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { IconLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { supabase } from '../../lib/supabase';
import { useMapContext } from '../../contexts/MapContext';
import { useTheme } from '../../contexts/ThemeContext';
import { WebMercatorViewport } from '@deck.gl/core';
import { Clipboard, ClipboardCopy, X } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

const ICON_MAPPING = {
  marker: { x: 0, y: -0, width: 26, height: 26, mask: true },
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
  const [selectedPOI, setSelectedPOI] = useState<POIData | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  const {
    hiddenPOITypes,
    viewState,
    setViewState,
    fitToAllLayers,
    deckRef,
  } = useMapContext();

  const MAPBOX_STYLE_DARK = import.meta.env.VITE_MAPBOX_STYLE_DARK;
  const MAPBOX_STYLE_LIGHT = import.meta.env.VITE_MAPBOX_STYLE_LIGHT;
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    const value = `${selectedPOI?.latitude}, ${selectedPOI?.longitude}`;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  useEffect(() => {
    if (pois.length > 0) {
      setTimeout(() => {
        fitToAllLayers();
      }, 500);
    }
  }, [pois]);

  const fetchPOIs = async () => {
    const { data, error } = await supabase
      .from('pois')
      .select(`id, name, latitude, longitude, type_id, poi_types (name, color)`);
    if (error) return;

    const formatted = data
      .map(poi => ({
        id: poi.id,
        name: poi.name,
        latitude: Number(poi.latitude),
        longitude: Number(poi.longitude),
        type_id: poi.type_id,
        type_name: poi.poi_types.name,
        type_color: poi.poi_types.color,
      }))
      .filter(isValidCoordinate);

    setPois(formatted);
  };

  useEffect(() => {
    fetchPOIs();
    const channel = supabase
      .channel('poi_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pois' }, fetchPOIs)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const updatePopupPosition = () => {
    if (selectedPOI && viewState) {
      const viewport = new WebMercatorViewport(viewState);
      const [x, y] = viewport.project([selectedPOI.longitude, selectedPOI.latitude]);
      setPopupPos({ x, y });
    }
  };

  useEffect(() => {
    updatePopupPosition();
  }, [viewState, selectedPOI]);

  const layers = [
    new IconLayer({
      id: 'poi-layer',
      data: pois.filter(p => !hiddenPOITypes.has(p.type_id)),
      pickable: true,
      iconAtlas: '/map-pin.svg',
      iconMapping: ICON_MAPPING,
      getIcon: () => 'marker',
      sizeScale: 2,
      getPosition: d => [d.longitude, d.latitude],
      getSize: () => 8,
      getColor: d => {
        const hex = d.type_color || '#000000';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b, 255];
      },
      onClick: ({ object }) => {
        setSelectedPOI(object);
        updatePopupPosition();
      },
    }),
  ];

  return (
    <div ref={containerRef} className="relative w-full h-full" onContextMenu={e => e.preventDefault()}>
      <DeckGL
        ref={deckRef}
        viewState={viewState}
        controller={true}
        onClick={(info, event) => {
          const clickedOnPOI = info?.object;
          const clickedInsidePopup = (event.srcEvent?.target as HTMLElement)?.closest('.custom-popup');

          if (!clickedOnPOI && !clickedInsidePopup) {
            setSelectedPOI(null);
          }
        }}
        onViewStateChange={({ viewState: next }) => {
          setViewState(prev => ({ ...prev, ...next, transitionDuration: 0 }));
        }}
        layers={layers}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <Map
          reuseMaps
          attributionControl={false}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={isDarkMode ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT}
        />
      </DeckGL>

      {selectedPOI && popupPos && (
        <div
          className={
            `custom-popup absolute text-sm shadow-md rounded-md px-4 py-3 pt-5
            ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`
          }
          style={{
            left: popupPos.x,
            top: popupPos.y - 10,
            pointerEvents: 'auto',
            transform: 'translate(-50%, -100%)',
          }}
        >
          <button
            className="absolute top-1 right-1 text-xs text-red-500 hover:text-red-600"
            onClick={() => setSelectedPOI(null)}
          >
            <X size={14} />
          </button>

          <div className="font-semibold">{selectedPOI.name}</div>
          <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Tipo: {selectedPOI.type_name}
          </div>

          <div className={`text-xs mt-2 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {selectedPOI.latitude}, {selectedPOI.longitude}
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-600 ml-2"
              aria-label="Copiar coordenadas"
            >
              <Clipboard size={14} />
            </button>
          </div>
          {(copied && !isMobile) && (
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Conteúdo copiado!
            </span>
          )}

          <div
            className={
              `absolute left-1/2 -bottom-2 w-0 h-0 
              border-x-8 border-x-transparent 
              ${isDarkMode ? 'border-t-zinc-800' : 'border-t-white'}
              border-t-8 transform -translate-x-1/2`
            }
          />
        </div>

      )}
    </div>
  );
};
