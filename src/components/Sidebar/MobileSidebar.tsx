import React, { useState } from 'react';
import { Menu, X, MapPinIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { menuItems, bottomNavItems } from './data';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface MobileSidebarProps {
  onHistoryClick?: () => void;
  onControlConsultarClick?: (itemLabel: string) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  onHistoryClick,
  onControlConsultarClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleMenuItemClick = (id: string) => {
    if (id === 'historico') {
      onHistoryClick?.();
    } else if (id === 'home') {
      navigate('/');
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg ${
          isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white text-gray-700'
        }`}
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] z-50 ${
                isDarkMode ? 'bg-[#353535]' : 'bg-[#EFF4FA]'
              } rounded-r-[20px] overflow-hidden`}
            >
              <div className="p-4 flex items-center gap-3">
                <Avatar className={`w-[45px] h-[45px] border-2 ${isDarkMode ? 'border-[#272727]' : 'border-white'}`}>
                  <AvatarFallback className="bg-[#95C0FF] text-white text-lg font-semibold">BL</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bem-vindo</span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Bruno Leonardi</span>
                </div>
              </div>

              <div className={`px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="text-xs">Menu</span>
              </div>

              <div className="px-2 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      isDarkMode
                        ? 'text-gray-300 hover:bg-zinc-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    } flex items-center justify-between`}
                  >
                    {item.label}
                    {item.badge && (
                      <Badge className={`${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-white text-gray-700'} text-xs`}>
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>

              <div className={`mt-4 px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="text-xs">Pontos de Interesse: <span className="font-bold">48</span></span>
              </div>

              <div className="px-2 space-y-1">
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                  isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  Pontos de Interesse
                </button>
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                  isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  UBS
                </button>
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                  isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  Hospitais
                </button>
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                  isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  Praças e Parques
                </button>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 border-t ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}`}>
                <div className="grid grid-cols-5 divide-x divide-gray-200">
                  {bottomNavItems.map((item) => {
                    if (item.id === 'home' && isHome) return null;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuItemClick(item.id)}
                        className={`py-4 text-center ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-zinc-800'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};