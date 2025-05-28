import React from 'react';
import { MapIcon, MapPinIcon } from 'lucide-react';

interface LocationItem {
  id: string;
  name: string;
  coordinates: string;
}

interface LocationPin {
  id: number;
  label: string;
  count: number;
  color: string;
  items: LocationItem[];
}

interface PointsOfInterestContentProps {
  data: LocationPin[];
  isDarkMode?: boolean;
}

export const PointsOfInterestContent: React.FC<PointsOfInterestContentProps> = ({ data, isDarkMode }) => {
  return (
    <div className="p-2 mt-1 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500">
      <div className="gap-3 mb-2">
        <div className="flex items-center mb-2">
          <div className="rounded-lg mr-2">
            <MapIcon size={18} strokeWidth={1.5} className={isDarkMode ? 'text-gray-300' : 'text-gray-900'} />
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Pontos de Interesse</p>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Confira abaixo os pontos de interesse que foram cadastrados para acompanhamento e monitoramento.
        </p>
      </div>
      <div className={`h-[1px] ${isDarkMode ? 'bg-gray-700' : 'bg-[#00000029]'}`} />
      <div className="space-y-1 mt-4">
        {data.map((category) => (
          <div key={category.id} className="mb-0 last:mb-0">
            <div className={`flex items-center gap-2 mb-3 sticky top-[-8px] rounded-lg p-1 z-10 ${isDarkMode ? 'bg-[#303031]' : 'bg-[#E9F0FA]'}`}>
              <MapPinIcon size={16} strokeWidth={1.5} style={{ fill: category.color, color: category.color }} />
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {category.label}
              </span>
            </div>
            <div className="space-y-0">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {item.coordinates}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};