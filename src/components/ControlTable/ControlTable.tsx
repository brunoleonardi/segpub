import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, EyeIcon, PencilIcon, Trash2Icon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

interface ControlTableProps {
  isDarkMode?: boolean;
  title: string;
}

const mockData = [
  { id: 'P08', tipo: 'Móvel', logradouro: '', local: 'DT-2700' },
  { id: 'P07', tipo: 'Móvel', logradouro: '', local: 'DT-2700' },
  { id: 'P10', tipo: 'Móvel', logradouro: '', local: 'DT-2700' },
  { id: 'P12', tipo: 'Fixo', logradouro: 'Rua das Laranjeiras, 123 - Vila Mariana', local: 'DT-2699' },
  { id: 'P13', tipo: 'Fixo', logradouro: 'Rua das Laranjeiras, 123 - Vila Mariana', local: 'DT-2699' },
  { id: 'P17', tipo: 'Móvel', logradouro: '', local: 'DT-2700' },
  { id: 'P20', tipo: 'Fixo', logradouro: 'Rua das Laranjeiras, 123 - Vila Mariana', local: 'DT-2699' },
  { id: 'P21', tipo: 'Móvel', logradouro: '', local: 'DT-2700' },
  { id: 'P24', tipo: 'Móvel', logradouro: '', local: 'DT-2700' },
  { id: 'P25', tipo: 'Móvel', logradouro: '', local: 'DT-2700' }
];

const ITEMS_PER_PAGE = 10;

export const ControlTable: React.FC<ControlTableProps> = ({ isDarkMode, title }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return mockData;
    
    const searchLower = searchTerm.toLowerCase();
    return mockData.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchLower)
      )
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  
  const paginatedData = React.useMemo(() => {
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

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={`w-full h-full p-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-[#EFF4FA]'}`}>
      <div className="max-w-[90dvw] mx-auto relative">
        <h2 className={`text-lg font-semibold absolute pt-4 left-0 top-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {title}
        </h2>

        <div className="flex flex-col">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Busca por Nome, Tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-[300px] h-9 pl-4 pr-8 text-sm rounded-lg ${
                  isDarkMode 
                    ? 'bg-zinc-800 text-gray-200 placeholder-gray-400' 
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <SearchIcon className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-3">
            <button
              className={`h-9 px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <span className="text-sm">+ Item Monitorado</span>
            </button>

            <button
              onClick={handleSelectAll}
              className={`h-9 px-4 py-2 text-sm rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Marcar Tudo
            </button>

            <button
              onClick={() => setSelectedItems([])}
              className={`h-9 px-4 py-2 text-sm rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Desmarcar Tudo
            </button>
          </div>

          <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-zinc-800' : 'bg-white'} border-b ${
                  isDarkMode ? 'border-zinc-700' : 'border-gray-200'
                }`}>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === paginatedData.length}
                      onChange={handleSelectAll}
                      className={`h-4 w-4 rounded ${
                        isDarkMode 
                          ? 'text-blue-500 bg-zinc-700 border-zinc-600' 
                          : 'text-blue-600 bg-gray-100 border-gray-300'
                      }`}
                    />
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Nome</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Tipo</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Logradouro</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Local de Instalação</th>
                  <th className={`px-4 py-3 text-center text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-t ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className={`h-4 w-4 rounded ${
                          isDarkMode 
                            ? 'text-blue-500 bg-zinc-700 border-zinc-600' 
                            : 'text-blue-600 bg-gray-100 border-gray-300'
                        }`}
                      />
                    </td>
                    <td className={`px-4 py-3 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{item.id}</td>
                    <td className={`px-4 py-3 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{item.tipo}</td>
                    <td className={`px-4 py-3 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{item.logradouro}</td>
                    <td className={`px-4 py-3 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{item.local}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className={`p-1.5 rounded-lg transition-colors ${
                          isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'
                        }`}>
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className={`p-1.5 rounded-lg transition-colors ${
                          isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'
                        }`}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className={`p-1.5 rounded-lg transition-colors ${
                          isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'
                        }`}>
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <div className={`flex gap-1 rounded-lg p-1 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-zinc-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};