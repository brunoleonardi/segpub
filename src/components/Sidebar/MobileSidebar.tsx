import React, { useEffect, useState } from 'react';
import { Menu, X, MapPinIcon, BellIcon, Locate, Home, SunIcon, MoonIcon, LogOutIcon, MonitorIcon, SettingsIcon, VideoIcon, PieChartIcon, MapIcon, ChevronLeftIcon, Moon, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { menuItems, bottomNavItems, monitoringData, controlData } from './data';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from '../../lib/utils';
import { useMapContext } from '../../contexts/MapContext';
import { supabase } from '../../lib/supabase';
import { MonitoringContent } from './MonitoringContent';
import { ControlContent } from './ControlContent';
import { PointsOfInterestContent } from './PointsOfInterestContent';

interface MobileSidebarProps {
  onHistoryClick?: () => void;
  onControlConsultarClick?: (itemLabel: string) => void;
}

interface POIType {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  onHistoryClick,
  onControlConsultarClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [poiTypes, setPoiTypes] = useState<POIType[]>([]);
  const { hiddenPOITypes, togglePOIType } = useMapContext();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [contentMode, setContentMode] = useState<boolean>(false);

  const toggleExpand = (key: string) => {
    const parts = key.split('_');
    const isVeiculosChild = parts.includes('veiculos');
    const isEmTransitoOrNaBase = parts.includes('emTransito') || parts.includes('naBase');

    setExpandedItems(prev => {
      const newItems = { ...prev };

      if (parts.length === 1) {
        Object.keys(prev).forEach(k => {
          if (k.split('_')[0] !== key) {
            delete newItems[k];
          }
        });
      }
      else if (isVeiculosChild && isEmTransitoOrNaBase) {
        Object.keys(prev).forEach(k => {
          if (k.includes('veiculos') && k !== 'veiculos' && k !== key) {
            delete newItems[k];
          }
        });
      }

      newItems[key] = !prev[key];
      return newItems;
    });
  };

  const handleCloseSidebar = () => {
    setActiveSection(null);
    setIsOpen(false);
    setExpandedItems({});
    setContentMode(false);
  };

  const fetchPOITypes = async () => {
    try {
      const { data: typesData, error: typesError } = await supabase
        .from('poi_types')
        .select('*')
        .order('name');

      if (typesError) throw typesError;

      const { data: poisData, error: poisError } = await supabase
        .from('pois')
        .select('*');

      if (poisError) throw poisError;

      const typesWithCount = typesData.map(type => ({
        ...type,
        count: poisData.filter(poi => poi.type_id === type.id).length
      }));

      setPoiTypes(typesWithCount);
    } catch (error) {
      console.error('Error fetching POI data:', error);
    }
  };

  useEffect(() => {
    fetchPOITypes();
  }, []);

  const menuIcons: Record<string, JSX.Element> = {
    monitoramento: <MonitorIcon size={20} strokeWidth={1.5} />,
    controle: <SettingsIcon size={20} strokeWidth={1.5} />,
    historico: <VideoIcon size={20} strokeWidth={1.5} />,
    estatisticas: <PieChartIcon size={20} strokeWidth={1.5} />
  };

  const getIconForMenuItem = (id: string) => menuIcons[id] || null;

  const navIcons: Record<string, JSX.Element> = {
    notifications: <BellIcon size={16} strokeWidth={1.5} />,
    location: <Locate size={16} strokeWidth={1.5} />,
    home: <Home size={16} strokeWidth={1.5} />,
    darkMode: isDarkMode ? <SunIcon size={16} /> : <MoonIcon size={16} strokeWidth={1.5} />,
    logout: <LogOutIcon size={16} strokeWidth={1.5} />
  };

  const getIconForNavItem = (id: string) => { return navIcons[id] || null };

  const fullOpenSections = ['monitoramento', 'controle', 'pontosInteresse'];
  const handleSectionClick = (section: string) => {
    if (section === 'darkMode') {
      toggleDarkMode();
      return;
    }

    if (section === 'home') {
      setIsOpen(false)
      navigate('/');
      return;
    }

    if (section === 'historico') {
      onHistoryClick?.();
      return;
    }

    if (fullOpenSections.includes(section)) {
      setActiveSection(section);
      setContentMode(true)
    } else {
      setActiveSection(section);
      setContentMode(false)
    }
  };

  const sectionComponents: Record<string, JSX.Element> = {
    monitoramento: (
      <MonitoringContent
        data={monitoringData}
        expandedItems={expandedItems}
        onToggleItem={toggleExpand}
        setContentMode={setContentMode}
      />
    ),
    controle: (
      <ControlContent
        data={controlData}
        onConsultarClick={onControlConsultarClick}
        setContentMode={setContentMode}
        setIsOpen={setIsOpen}
      />
    ),
    pontosInteresse: (
      <PointsOfInterestContent
        onPOITypeCreated={fetchPOITypes}
        setContentMode={setContentMode}
      />
    )
  };

  const renderContent = () => {
    return sectionComponents[activeSection || ''] || null;
  };

  return (
    <>
      <div className="flex z-30 justify-center w-full fixed top-4">
        {/* Campo de busca */}
        <div
          className={`flex gap-2 px-4 py-3 w-[90dvw] rounded-full shadow-md backdrop-blur-md ${isDarkMode ? 'bg-zinc-700/40' : 'bg-[#D5E6FF]/40'
            }`}
        >
          <Menu
            onClick={() => setIsOpen(true)}
            size={20}
            className={`${isDarkMode ? 'text-gray-200' : 'text-gray-600'} mr-2`}
          />
          <input
            type="text"
            placeholder="Buscar Endereço"
            className={`bg-transparent outline-none text-sm w-full ${isDarkMode
              ? 'text-gray-100 placeholder-gray-400'
              : 'text-gray-700 placeholder-gray-500'
              }`}
          />
        </div>

        {/* Barra de ações */}
        <div className="absolute left-0 top-14 z-30 w-full overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max px-[20px]">
            <ActionButton
              icon={<Locate size={16} />}
              label="Centralizar itens"
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Moon size={16} />}
              handleClick={toggleDarkMode}
              label={isDarkMode ? 'Modo Claro' : 'Modo Noturno'}
              isDarkMode={isDarkMode}
            />
            <ActionButton
              icon={<Bell size={16} />}
              label="Notificações"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>


      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseSidebar}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className={`fixed top-0 left-0 h-full w-[85%] max-w-[90%] z-50 ${isDarkMode ? 'bg-[#353535]' : 'bg-[#EFF4FA]'
                } rounded-r-[20px] overflow-hidden`}
            >
              <div className={`p-2 flex justify-between items-center`}>
                <div className={`flex items-center gap-3`}>
                  <Avatar className={`w-[45px] h-[45px] border-2 ${isDarkMode ? 'border-[#272727]' : 'border-white'}`}>
                    <AvatarFallback className="bg-[#95C0FF] text-white text-lg font-semibold">BL</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="theme-aware-text-secondary text-xs">Bem-vindo</span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bruno Leonardi</span>
                  </div>
                </div>
                <button onClick={handleCloseSidebar} className="theme-aware-hover theme-aware-text p-1 rounded-full transition-colors">
                  <ChevronLeftIcon size={20} />
                </button>
              </div>

              {!contentMode ? (
                <>
                  <div className={`px-4 py-2 flex items-center justify-between`}>
                    <span className="theme-aware-text-secondary text-xs">Menu</span>
                  </div>
                  {menuItems.map((item) => (
                    <div
                      className={cn(
                        "flex items-center h-10 px-4 cursor-pointer rounded-lg mx-2",
                      )}
                      onClick={() => handleSectionClick(item.id)}
                    >
                      <div className="relative theme-aware-text">
                        {getIconForMenuItem(item.id)}
                        {item.badge && (
                          <Badge className={`absolute -top-2 -right-3 w-[18px] h-[16px] rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-zinc-700 border-white text-white hover:bg-zinc-700' : 'bg-white border-black text-black hover:bg-white'}`}>
                            <span className="text-[10px] font-semibold">{item.badge}</span>
                          </Badge>
                        )}
                      </div>
                      <span className="theme-aware-text ml-3 text-sm">{item.label}</span>
                    </div>
                  ))}

                  <div className="my-2 px-3 w-full">
                    <div className="theme-aware-divider h-[1px] w-full" />
                  </div>


                  <div className={`px-4 py-2 flex items-center justify-between`}>
                    <span className="theme-aware-text-secondary text-xs">
                      Pontos de Interesse: <span className="font-bold">
                        {poiTypes.reduce((acc, type) => acc + type.count, 0)}
                      </span>
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex items-center h-10 px-4 cursor-pointer rounded-lg mx-2",
                    )}
                    onClick={() => handleSectionClick("pontosInteresse")}
                  >
                    <MapIcon size={20} strokeWidth={1.5} className="theme-aware-text" />
                    <span className="theme-aware-text ml-3 text-sm">Pontos de Interesse</span>
                  </div>


                  <div className="theme-aware-card mx-2 my-2 rounded-xl">
                    <div className="p-4">
                      {poiTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`flex items-center gap-3 mb-5 last:mb-0 cursor-pointer`}
                          onClick={() => togglePOIType(type.id)}
                          style={{ opacity: hiddenPOITypes.has(type.id) ? 0.5 : 1 }}
                        >
                          <div className="relative">
                            <MapPinIcon size={20} style={{ fill: type.color, color: type.color }} />
                            <Badge className="absolute -top-2 -right-3 w-[18px] h-[16px] rounded-full border border-white flex items-center justify-center" style={{ backgroundColor: type.color }}>
                              <span className="text-[10px] text-white font-semibold">{type.count}</span>
                            </Badge>
                          </div>
                          <span className="theme-aware-text text-sm pl-3">{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-2">
                    <span className="theme-aware-text-secondary text-xs">Atalhos e Notificações</span>
                  </div>
                  <div className="mx-2 mb-4">
                    <div className="theme-aware-card flex items-center justify-between px-3 py-1.5 rounded-lg">
                      {bottomNavItems.map((item) => {
                        if (item.id === 'home' && isHome) return null;

                        return (
                          <div
                            className={cn(
                              "p-1.5 rounded-lg cursor-pointer transition-colors theme-aware-text",
                            )}
                            onClick={() => handleSectionClick(item.id)}
                          >
                            {getIconForNavItem(item.id)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex-1">
                  {renderContent()}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const ActionButton = ({
  icon,
  label,
  isDarkMode,
  handleClick
}: {
  icon: React.ReactNode;
  label: string;
  isDarkMode: boolean;
  handleClick?: () => void;
}) => {
  return (
    <button
      onClick={() => handleClick?.()}
      className={`flex items-center border flex-nowrap gap-2 px-3 py-1.5 rounded-full text-sm transition-colors shadow-sm whitespace-nowrap
        ${isDarkMode
          ? 'bg-zinc-800 border-zinc-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-700'}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

