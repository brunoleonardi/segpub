import {
  MapIcon,
  MapPinIcon,
  MonitorIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  SettingsIcon,
  VideoIcon,
  BellIcon,
  HomeIcon,
  MapPinIcon as LocationIcon,
  MoonIcon,
  LogOutIcon,
  ChevronLeftIcon,
  SunIcon,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { MonitoringContent } from "./MonitoringContent";
import { ControlContent } from "./ControlContent";
import { PointsOfInterestContent } from "./PointsOfInterestContent";
import { monitoringData, controlData, locationPins, menuItems, bottomNavItems } from "./data";
import { cn } from "../../lib/utils";
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface SidebarProps {
  onDarkModeChange?: (darkMode: boolean) => void;
  onHistoryClick?: () => void;
  onControlConsultarClick?: (itemLabel: string) => void;
}

export const Sidebar = ({ onDarkModeChange, onHistoryClick, onControlConsultarClick }: SidebarProps): JSX.Element => {
  const [stage, setStage] = useState<'closed' | 'half' | 'full'>('closed');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    setStage('closed');
    setActiveSection(null);
    setExpandedItems({});
  };

  const fullOpenSections = ['monitoramento', 'controle', 'pontosInteresse'];

  const handleSectionClick = (section: string) => {
    if (section === 'darkMode') {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      onDarkModeChange?.(newDarkMode);
      return;
    }

    if (section === 'historico') {
      onHistoryClick?.();
      return;
    }

    if (fullOpenSections.includes(section)) {
      setStage('full');
      setActiveSection(section);
    } else {
      setStage('half');
      setActiveSection(section);
    }
  };

  const sectionComponents: Record<string, JSX.Element> = {
    monitoramento: (
      <MonitoringContent
        data={monitoringData}
        expandedItems={expandedItems}
        onToggleItem={toggleExpand}
        isDarkMode={isDarkMode}
      />
    ),
    controle: (
      <ControlContent
        data={controlData}
        isDarkMode={isDarkMode}
        onConsultarClick={onControlConsultarClick}
      />
    ),
    pontosInteresse: (
      <PointsOfInterestContent
        data={locationPins}
        isDarkMode={isDarkMode}
      />
    )
  };

  const renderContent = () => {
    return sectionComponents[activeSection || ''] || null;
  };

  const menuIcons: Record<string, JSX.Element> = {
    monitoramento: <MonitorIcon size={20} strokeWidth={1.5}/>,
    controle: <SettingsIcon size={20} strokeWidth={1.5}/>,
    historico: <VideoIcon size={20} strokeWidth={1.5}/>,
    estatisticas: <PieChartIcon size={20} strokeWidth={1.5}/>
  };

  const getIconForMenuItem = (id: string) => menuIcons[id] || null;

  const navIcons: Record<string, JSX.Element> = {
    notifications: <BellIcon size={16} strokeWidth={1.5} />,
    location: <LocationIcon size={16} strokeWidth={1.5} />,
    darkMode: isDarkMode ? <SunIcon size={16} /> : <MoonIcon size={16} strokeWidth={1.5} />,
    logout: <LogOutIcon size={16} strokeWidth={1.5} />
  };

  const getIconForNavItem = (id: string) => navIcons[id] || null;

  return (
    <TooltipProvider>
      <motion.div
        className={cn(
          "theme-aware-sidebar rounded-[20px] shadow-[2px_2px_7px_#00000040] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)] relative flex flex-col select-none",
          isDarkMode ? "text-white" : ""
        )}
        animate={{ width: stage === 'closed' ? 66 : stage === 'half' ? 220 : 450 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`p-2 flex ${stage === 'closed' ? 'justify-center' : 'justify-between items-center'}`}>
          <div className={`flex items-center ${stage === 'closed' ? '' : 'gap-3'}`}>
            <Avatar className="w-[45px] h-[45px] border-2 border-white">
              <AvatarFallback className="bg-[#95C0FF] text-white text-lg">BL</AvatarFallback>
            </Avatar>
            {stage !== 'closed' && (
              <div className="flex flex-col">
                <span className="theme-aware-text-secondary text-xs">Bem-vindo</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bruno Leonardi</span>
              </div>
            )}
          </div>
          {stage !== 'closed' && (
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button onClick={handleCloseSidebar} className="theme-aware-hover p-1 rounded-full transition-colors">
                  <ChevronLeftIcon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="theme-aware-tooltip">
                Fechar Menu
              </TooltipContent>
            </TooltipRoot>
          )}
        </div>

        <div className={`w-full flex ${stage === 'closed' ? 'flex-col items-center gap-2' : ''}`}>
          <div className={`flex-1 ${stage === 'closed' ? 'flex flex-col items-center' : ''}`}>
            <div className={`px-4 py-2 ${stage === 'closed' ? 'text-center' : 'flex items-center justify-between'}`}>
              <span className="theme-aware-text-secondary text-xs">Menu</span>
            </div>

            {menuItems.map((item) => (
              <TooltipRoot key={item.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center h-10 px-4 cursor-pointer rounded-lg mx-2",
                      stage === 'closed' ? 'justify-center' : '',
                      activeSection === item.id ? 'theme-aware-active' : 'theme-aware-hover'
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
                    {stage !== 'closed' && <span className="theme-aware-text ml-3 text-sm">{item.label}</span>}
                  </div>
                </TooltipTrigger>
                {stage === 'closed' && (
                  <TooltipContent side="right" className="theme-aware-tooltip">
                    {item.label}
                  </TooltipContent>
                )}
              </TooltipRoot>
            ))}

            <div className="my-2 px-3 w-full">
              <div className="theme-aware-divider h-[1px] w-full" />
            </div>

            <div className={`px-4 py-2 ${stage === 'closed' ? 'text-center' : 'flex items-center justify-between'}`}>
              <span className="theme-aware-text-secondary text-xs">
                {stage === 'closed' ? 'PIs: ' : 'Pontos de Interesse: '}<span className="font-bold">46</span>
              </span>
            </div>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center h-10 px-4 cursor-pointer rounded-lg mx-2",
                    stage === 'closed' ? 'justify-center' :
                    '',
                    activeSection === "pontosInteresse" ? 'theme-aware-active' : 'theme-aware-hover'
                  )}
                  onClick={() => handleSectionClick("pontosInteresse")}
                >
                  <MapIcon size={20} strokeWidth={1.5} className="theme-aware-text" />
                  {stage !== 'closed' && <span className="theme-aware-text ml-3 text-sm">Pontos de Interesse</span>}
                </div>
              </TooltipTrigger>
              {stage === 'closed' && (
                <TooltipContent side="right" className="theme-aware-tooltip">
                  Pontos de Interesse
                </TooltipContent>
              )}
            </TooltipRoot>

            <div className="theme-aware-card mx-2 my-2 rounded-xl">
              <div className="p-4">
                {locationPins.map((pin) => (
                  <div key={pin.id} className={`flex items-center ${stage === 'closed' ? 'justify-center' : ''} gap-3 mb-5 last:mb-0`}>
                    <div className="relative">
                      <MapPinIcon size={20} style={{ fill: pin.color, color: pin.color }} />
                      <Badge className="absolute -top-2 -right-3 w-[18px] h-[16px] rounded-full border border-white flex items-center justify-center" style={{ backgroundColor: pin.color }}>
                        <span className="text-[10px] text-white font-semibold">{pin.count}</span>
                      </Badge>
                    </div>
                    {stage !== 'closed' && <span className="theme-aware-text text-sm">{pin.label}</span>}
                  </div>
                ))}
              </div>
            </div>

            {stage !== 'closed' ? (
              <>
                <div className="px-4 py-2">
                  <span className="theme-aware-text-secondary text-xs">Atalhos e Notificações</span>
                </div>
                <div className="mx-2 mb-4">
                  <div className="theme-aware-card flex items-center justify-between px-3 py-1.5 rounded-lg">
                    {bottomNavItems.map((item) => (
                      <TooltipRoot key={item.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "p-1.5 rounded-lg cursor-pointer transition-colors",
                              activeSection === item.id ? 'theme-aware-active' : 'theme-aware-hover theme-aware-text'
                            )}
                            onClick={() => handleSectionClick(item.id)}
                          >
                            {getIconForNavItem(item.id)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="theme-aware-tooltip">
                          {item.label}
                        </TooltipContent>
                      </TooltipRoot>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-center">
                  <span className="theme-aware-text-secondary text-xs">Mais</span>
                </div>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <div
                      className="theme-aware-hover flex justify-center p-2 mb-2 cursor-pointer rounded-lg mx-2"
                      onClick={() => setStage('half')}
                    >
                      <MoreHorizontalIcon size={20} className="theme-aware-text" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="theme-aware-tooltip">
                    Expandir Menu
                  </TooltipContent>
                </TooltipRoot>
              </>
            )}
          </div>

          {stage === 'full' && <div className="theme-aware-divider w-[1px] mx-2" />}

          {stage === 'full' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="flex-1">
              {renderContent()}
            </motion.div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};