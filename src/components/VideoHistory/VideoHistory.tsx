import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, SquareIcon, DownloadIcon, SquareCheckBigIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Checkbox } from '../ui/checkbox';

interface VideoHistoryProps {
  isDarkMode?: boolean;
  onClose: () => void;
}

const mockData = [
  { id: 1, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 2, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 3, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 4, status: 'Concluído', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 5, status: 'Processando', veiculo: 'GRVT-P01', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 6, status: 'Concluído', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 7, status: 'Concluído', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 8, status: 'Concluído', veiculo: 'GRVT-P01', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 9, status: 'Concluído', veiculo: 'GRVT-P01', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 10, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 11, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 12, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 13, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 14, status: 'Concluído', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 15, status: 'Processando', veiculo: 'GRVT-P01', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 16, status: 'Concluído', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 17, status: 'Concluído', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 18, status: 'Concluído', veiculo: 'GRVT-P01', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 19, status: 'Concluído', veiculo: 'GRVT-P01', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
  { id: 20, status: 'Processando', veiculo: 'GRVT-P05', inicio: '07/05/2025 08:04', fim: '08/05/2025 14:35' },
];

const ITEMS_PER_PAGE = 10;

export const VideoHistory: React.FC<VideoHistoryProps> = ({ onClose }) => {
  const { isDarkMode } = useTheme()
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return mockData;

    const searchLower = searchTerm.toLowerCase();
    return mockData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchLower)
      )
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(item => item.id));
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 50);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 7;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisibleButtons) {
      const leftOffset = Math.floor(maxVisibleButtons / 2);
      const rightOffset = maxVisibleButtons - leftOffset - 1;

      if (currentPage <= leftOffset) {
        endPage = maxVisibleButtons;
      } else if (currentPage > totalPages - rightOffset) {
        startPage = totalPages - maxVisibleButtons + 1;
      } else {
        startPage = currentPage - leftOffset;
        endPage = currentPage + rightOffset;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${currentPage === i
            ? 'bg-blue-400 text-white'
            : isDarkMode
              ? 'text-gray-300 hover:bg-zinc-700'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      buttons.unshift(
        <span key="start-ellipsis" className={`px-3 py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>...</span>
      );
      buttons.unshift(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 rounded-md ${isDarkMode
            ? 'text-gray-300 hover:bg-zinc-700'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          1
        </button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(
        <span key="end-ellipsis\" className={`px-3 py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>...</span>
      );
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-md ${isDarkMode
            ? 'text-gray-300 hover:bg-zinc-700'
            : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        className="fixed inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{
          type: "spring",
          duration: 0.3,
          bounce: 0.2
        }}
        className={`w-[90%] max-w-6xl max-h-[90dvh] rounded-2xl ${isDarkMode
          ? 'bg-zinc-900/60'
          : 'bg-[#EFF4FA] bg-opacity-60'
          } backdrop-blur-[2px] px-6 pt-5 shadow-md flex flex-col relative cursor-default z-50`}
        onClick={(e: any) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-3"
        >
          <h2 className={`text-lg font-semibold absolute self-start mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Histórico de Vídeos
          </h2>

          <div className="w-full max-w-md">
            <div className="relative">
              <input
                name="search"
                type="text"
                placeholder="Busque por Palavras-chave"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full h-8 pl-4 pr-8 text-xs rounded-full ${isDarkMode
                  ? 'bg-zinc-800 text-gray-200 placeholder-gray-400'
                  : 'bg-white text-gray-900 placeholder-gray-500'
                  }`}
              />
              <SearchIcon className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelectAll}
              className={`px-4 py-1.5 text-xs rounded-full transition-colors flex items-center gap-2 ${isDarkMode
                ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <SquareCheckBigIcon size={14} />
              Marcar Tudo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedItems([])}
              className={`px-4 py-1.5 text-xs rounded-full transition-colors flex items-center gap-2 ${isDarkMode
                ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <SquareIcon size={14} />
              Desmarcar Tudo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg flex-1 overflow-hidden flex flex-col"
        >
          <div className="overflow-auto flex-1 shadow-md">
            <table className={`w-full ${isDarkMode ? 'bg-zinc-800' : 'bg-white'} rounded-lg`}>
              <thead className="sticky top-0">
                <tr className={`${isDarkMode
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-white border-gray-200'
                  } border-b`}>
                  <th className="px-3 py-2 text-left w-8"></th>
                  <th className={`px-3 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>ID</th>
                  <th className={`px-3 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Status</th>
                  <th className={`px-3 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Veículo</th>
                  <th className={`px-3 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Início</th>
                  <th className={`px-3 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Fim</th>
                  <th className={`px-3 py-2 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.2
                    }}
                    className={`border-t ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'} ${selectedItems.includes(item.id)
                      ? isDarkMode
                        ? 'bg-[#333333]'
                        : 'bg-[#f9f9f9]'
                      : isDarkMode
                        ? ''
                        : ''
                      }`}
                  >
                    <td className="px-3 py-3">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        isDarkMode={isDarkMode}
                        size="sm"
                      />
                    </td>
                    <td className={`px-3 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{item.id}</td>
                    <td className={`px-3 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{item.status}</td>
                    <td className={`px-3 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{item.veiculo}</td>
                    <td className={`px-3 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{item.inicio}</td>
                    <td className={`px-3 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>{item.fim}</td>
                    <td className="px-3 py-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1.5 rounded-lg transition-colors ${isDarkMode
                          ? 'hover:bg-zinc-600'
                          : 'hover:bg-gray-100'
                          }`}
                      >
                        <DownloadIcon className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={7} className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      Nenhum resultado encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-center">
            <div className={`flex gap-1 rounded-lg p-0.5 shadow-md ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
              }`}>
              {renderPaginationButtons()}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};