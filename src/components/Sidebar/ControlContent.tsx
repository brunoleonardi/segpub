import React, { useState, useRef, useEffect } from 'react';
import { 
  UserIcon, 
  UsersIcon, 
  SearchIcon, 
  SmartphoneIcon, 
  MonitorIcon,
  BuildingIcon,
  MailIcon,
  FileTextIcon,
  BellIcon,
  SettingsIcon
} from 'lucide-react';

interface ControlItem {
  id: string;
  label: string;
  icon: string;
  options: string[];
}

interface ControlContentProps {
  data: ControlItem[];
  isDarkMode?: boolean;
  onConsultarClick?: (itemLabel: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  user: <UserIcon size={16} strokeWidth={1.5} />,
  users: <UsersIcon size={16} strokeWidth={1.5} />,
  search: <SearchIcon size={16} strokeWidth={1.5} />,
  smartphone: <SmartphoneIcon size={16} strokeWidth={1.5} />,
  monitor: <MonitorIcon size={16} strokeWidth={1.5} />,
  building: <BuildingIcon size={16} strokeWidth={1.5} />,
  mail: <MailIcon size={16} strokeWidth={1.5} />,
  'file-text': <FileTextIcon size={16} strokeWidth={1.5} />,
  bell: <BellIcon size={16} strokeWidth={1.5} />
};

import { controlOptionsLabels } from './data';

export const ControlContent: React.FC<ControlContentProps> = ({ data, isDarkMode, onConsultarClick }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
    event.stopPropagation();
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleOptionClick = (itemLabel: string, option: string) => {
    if (option === 'consultar' && onConsultarClick) {
      onConsultarClick(itemLabel);
    }
  };

  return (
    <div className="p-2 mt-1" ref={containerRef}>
      <div className="gap-3 mb-2">
        <div className="flex items-center mb-2">
          <div className="rounded-lg mr-2">
            <SettingsIcon size={18} strokeWidth={1.5} className={isDarkMode ? 'text-gray-300' : 'text-gray-900'} />
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Controle</p>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Escolha uma das opções abaixo para realizar o cadastro ou consultar os dados que precisa.
        </p>
      </div>
      <div className={`h-[1px] ${isDarkMode ? 'bg-gray-700' : 'bg-[#00000029]'}`} />
      <div className="space-y-1 mt-4 relative">
        {data.map((item) => (
          <div key={item.id} className="relative">
            <button
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                selectedItem === item.id 
                  ? isDarkMode ? 'bg-gray-100/5' : 'bg-blue-600/5'
                  : isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-50'
              }`}
              onClick={(e) => handleItemClick(e, item.id)}
            >
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {iconMap[item.icon]}
              </div>
              <span className={`text-xs ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
            
            {selectedItem === item.id && (
              <div 
                className={`absolute z-50 rounded-lg shadow-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}
                style={{
                  top: '100%',
                  left: 0,
                  width: '100%',
                  marginTop: '4px'
                }}
              >
                {item.options.map((optionId) => (
                  <button
                    key={optionId}
                    className={`w-full text-start px-3 py-2 text-xs ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-zinc-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    } transition-colors first:rounded-t-lg last:rounded-b-lg`}
                    onClick={() => handleOptionClick(item.label, optionId)}
                  >
                    {controlOptionsLabels[optionId]}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};