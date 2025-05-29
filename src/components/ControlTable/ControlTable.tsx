import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, EyeIcon, PencilIcon, Trash2Icon, ChevronDownIcon, ChevronRightIcon, Plus, SquareCheckBigIcon, SquareIcon, CircleChevronLeft, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useTheme } from '../../contexts/ThemeContext';

interface ControlTableProps {
  isDarkMode?: boolean;
  title: string;
}

interface EmailReport {
  id: string;
  project: string;
  email: string;
  name: string;
  active: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export const ControlTable: React.FC<ControlTableProps> = ({ title }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme()
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<EmailReport[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchEmailReports = async () => {
    try {
      const { data: emailReports, error } = await supabase
        .from('email_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(emailReports || []);
    } catch (error) {
      console.error('Error fetching email reports:', error);
    }
  };

  useEffect(() => {
    if (title === 'e-Mails Relatório') {
      fetchEmailReports();

      const channel = supabase
        .channel('email_reports_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'email_reports' },
          () => {
            fetchEmailReports();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [title]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSelectedItems(prev => prev.filter(item => item !== id));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      await fetchEmailReports();
    } catch (error) {
      console.error('Error deleting email report:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (report: EmailReport) => {
    navigate(`/register/e-Mails Relatório`, {
      state: {
        editMode: true,
        reportData: report
      }
    });
  };

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;

    const searchLower = searchTerm.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchLower)
      )
    );
  }, [searchTerm, data]);

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
    <div className={`w-full h-full p-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-[#EEF3FA]'}`}>
      <div className="max-w-[90dvw] mx-auto relative">
        <h2 onClick={() => navigate('/')} className={`cursor-pointer text-lg font-semibold absolute flex gap-2 items-center pt-4 left-0 top-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <ArrowLeft size={23} className='pt-0.5' /> {title}
        </h2>

        <div className="flex flex-col">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Busca por Nome, Tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-[300px] h-8 pl-4 pr-8 text-xs rounded-full ${isDarkMode
                  ? 'bg-zinc-800 text-gray-200 placeholder-gray-400'
                  : 'bg-white text-gray-900 placeholder-gray-500'
                  }`}
              />
              <SearchIcon className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-3">
            <button
              onClick={() => navigate(`/register/${title}`)}
              className={`px-4 py-1.5 text-xs rounded-full transition-colors flex items-center gap-2 ${isDarkMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              <Plus size={14} /> {title}
            </button>

            <button
              onClick={handleSelectAll}
              className={`px-4 py-1.5 text-xs rounded-full transition-colors flex items-center gap-2 ${isDarkMode
                ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <SquareCheckBigIcon size={14} /> Marcar Tudo
            </button>

            <button
              onClick={() => setSelectedItems([])}
              className={`px-4 py-1.5 text-xs rounded-full transition-colors flex items-center gap-2 ${isDarkMode
                ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <SquareIcon size={14} /> Desmarcar Tudo
            </button>
          </div>

          <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-zinc-800' : 'bg-white'} border-b ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'
                  }`}>
                  <th className="w-12 px-4 py-3">
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Projeto</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Email</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Nome</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Status</th>
                  <th className={`px-4 py-3 text-center text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
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
                          className={`h-4 w-4 rounded ${isDarkMode
                            ? 'text-blue-500 bg-zinc-700 border-zinc-600'
                            : 'text-blue-600 bg-gray-100 border-gray-300'
                            }`}
                        />
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>{item.project}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>{item.email}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>{item.name}</td>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>{item.active ? 'Ativo' : 'Inativo'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-white hover:bg-zinc-700' : 'hover:bg-gray-100'}`}
                            onClick={() => handleEdit(item)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'}`}
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash2Icon className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={`text-center text-sm py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Nenhum dado encontrado na tabela.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {paginatedData.length > 0 && (
            <div className="flex justify-center mt-4">
              <div className={`flex gap-1 rounded-lg shadow-md p-0.5 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${currentPage === i + 1
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
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className={isDarkMode ? 'bg-zinc-800 border-zinc-700' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDarkMode ? 'text-gray-200' : ''}>
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={isDarkMode ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600' : ''}
              onClick={() => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};