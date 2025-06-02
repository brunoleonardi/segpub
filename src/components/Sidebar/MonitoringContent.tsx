import React, { useState } from 'react';
import { ChevronDownIcon, ChevronLeft, ChevronRightIcon, MonitorIcon, WifiIcon, WifiOffIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Item {
  id: string;
  label: string;
  status: string;
  lastSeen?: string;
}

interface AccordionData {
  label: string;
  items: Item[] | Record<string, any>;
}

interface AccordionItemProps {
  label: string;
  isExpanded: boolean;
  onToggle: () => void;
  level?: number;
  children?: React.ReactNode;
  isDarkMode?: boolean;
  parentKey?: string;
}

interface ItemsListProps {
  items: Item[];
  level: number;
  isDarkMode?: boolean;
}

interface MonitoringContentProps {
  data: Record<string, AccordionData>;
  expandedItems: Record<string, boolean>;
  onToggleItem: (key: string) => void;
  isDarkMode?: boolean;
  setContentMode?: (condition: boolean) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  label,
  isExpanded,
  onToggle,
  level = 0,
  children,
  parentKey = ''
}) => {
  const { isDarkMode } = useTheme()

  const getBackgroundColor = () => {
    if (!isExpanded) return '';

    if (parentKey.includes('emTransito') || parentKey.includes('naBase')) {
      return isDarkMode ? 'bg-gray-100 bg-opacity-10' : 'bg-blue-600 bg-opacity-10';
    }

    return isDarkMode ? 'bg-gray-100 bg-opacity-15' : 'bg-blue-600 bg-opacity-15';
  };

  return (
    <div className={`${level > 0 ? "ml-4 border-l-2 border-dashed border-gray-500 pl-4" : ""} mb-1`}>
      <div
        className={`flex items-center justify-between cursor-pointer h-10 px-3 rounded ${getBackgroundColor()
          } ${!isExpanded && (isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-50')}`}
        onClick={onToggle}
      >
        <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
        {children && (
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon size={16} />
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="mt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ItemsList: React.FC<ItemsListProps> = ({ items, level }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { isDarkMode } = useTheme()

  const getItemBackground = (itemId: string) => {
    if (selectedItem === itemId) {
      return isDarkMode ? 'bg-gray-100/5' : 'bg-blue-600/5';
    }
    return '';
  };

  return (
    <div className={`space-y-1 ${level > 0 ? "ml-2 border-l-2 border-dashed border-gray-500 pl-2" : ""}`}>
      {items.map(item => (
        <button
          key={item.id}
          className={`flex w-full px-3 py-2 rounded-lg transition-colors ${getItemBackground(item.id)
            } ${isDarkMode
              ? 'hover:bg-zinc-800'
              : 'hover:bg-gray-50'
            }`}
          onClick={() => setSelectedItem(item.id)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className={`text-xs text-start ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.label}
              </span>
              {item.status === 'offline' && item.lastSeen && (
                <div className="flex flex-col items-start mt-1">
                  <span className="text-[10px] text-gray-400">Última localização:</span>
                  <span className="text-[10px] text-gray-400">{item.lastSeen}</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {item.status === 'online' ? (
                <WifiIcon size={18} className="text-green-500" />
              ) : (
                <WifiOffIcon size={18} className="text-red-500" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export const MonitoringContent: React.FC<MonitoringContentProps> = ({
  data,
  expandedItems,
  onToggleItem,
  setContentMode
}) => {
  const { isDarkMode } = useTheme()
  const isMobile = useIsMobile();

  const renderAccordionContent = (content: any, parentKey: string = '', level: number = 0) => {
    if (Array.isArray(content)) {
      return <ItemsList items={content} level={level} />;
    }

    if (typeof content === 'object') {
      return Object.entries(content).map(([key, value]: [string, any]) => {
        if (key === 'label') return null;

        const currentKey = parentKey ? `${parentKey}_${key}` : key;

        if (key === 'items') {
          return renderAccordionContent(value, parentKey, level + 1);
        }

        return (
          <AccordionItem
            key={currentKey}
            label={value.label}
            isExpanded={!!expandedItems[currentKey]}
            onToggle={() => onToggleItem(currentKey)}
            level={level}
            parentKey={currentKey}
          >
            {renderAccordionContent(value.items, currentKey, level + 1)}
          </AccordionItem>
        );
      });
    }

    return null;
  };

  return (
    <div className="p-2 mt-1">
      <div className="gap-3 mb-2">
        <div className="flex items-center mb-2">
          <div className="rounded-lg mr-2">
            {isMobile ? (
              <ChevronLeft onClick={() => setContentMode?.(false)} size={22} strokeWidth={2} className={isDarkMode ? 'text-gray-300' : 'text-gray-900'} />
            ) : (
              <MonitorIcon size={18} strokeWidth={1.5} className={isDarkMode ? 'text-gray-300' : 'text-gray-900'} />
            )}
          </div>
          <p onClick={() => setContentMode?.(false)} className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Monitoramento</p>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 ${isMobile ? 'py-2' : ''}`}>
          Acesse a câmera desejada através das abas abaixo:
        </p>
      </div>
      <div className={`h-[1px] ${isDarkMode ? 'bg-gray-700' : 'bg-[#00000029]'}`} />
      <div className="space-y-1 mt-4">
        {renderAccordionContent(data)}
      </div>
    </div>
  );
};