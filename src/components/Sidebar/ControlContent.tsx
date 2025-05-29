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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
  const containerRef = useRef<HTMLDivElement>(null);

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
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-50'
              }`}>
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {iconMap[item.icon]}
                </div>
                <span className={`text-xs ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`text-xs ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white'}`}
              align="end"
            >
              {item.options.map((optionId) => (
                <DropdownMenuItem
                  key={optionId}
                  className={`text-xs ${isDarkMode ? 'text-gray-300 focus:bg-zinc-700' : 'text-gray-600 focus:bg-gray-100'}`}
                  onClick={() => handleOptionClick(item.label, optionId)}
                >
                  {controlOptionsLabels[optionId]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  );
};