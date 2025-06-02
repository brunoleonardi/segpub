import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { menuItems, bottomNavItems } from './data';
import { useLocation, useNavigate } from 'react-router-dom';

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
                isDarkMode ? 'bg-zinc-900' : 'bg-white'
              } p-4`}
            >
              <button
                onClick={() => setIsOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-lg ${
                  isDarkMode ? 'text-gray-300 hover:bg-zinc-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <X size={24} />
              </button>

              <div className="mt-16 space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg ${
                      isDarkMode
                        ? 'text-gray-300 hover:bg-zinc-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        isDarkMode ? 'bg-zinc-700 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}`}>
                {bottomNavItems.map((item) => {
                  if (item.id === 'home' && isHome) return null;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-zinc-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};