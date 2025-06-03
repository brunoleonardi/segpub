import { Edit, Pencil, PencilIcon, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { cn, removeFinalSFromFirstAndSecondWord } from '../../lib/utils';
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from '../../components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useIsMobile } from '../../hooks/useIsMobile';

const fieldConfigs = [
  { name: 'project', label: 'Projeto', colSpan: 1 },
  { name: 'email', label: 'e-Mail', colSpan: 1 },
  { name: 'name', label: 'Nome Completo', colSpan: 1 },
  { name: 'active', label: 'Ativo', colSpan: 1 },
] as const;

export const DetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const reportData = location.state?.reportData || {};
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { section } = useParams();
  const title = removeFinalSFromFirstAndSecondWord(section as string);

  const handleEdit = () => {
    navigate(`/register/e-Mails Relatório`, {
      state: {
        editMode: true,
        reportData: {
          id: reportData.id,
          project: reportData.project,
          email: reportData.email,
          name: reportData.name,
          active: reportData.active,
        },
      },
    });
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('email_reports')
        .delete()
        .eq('id', reportData.id);

      if (error) throw error;

      navigate('/control/e-Mails Relatório');
    } catch (error) {
      console.error('Error deleting email report:', error);
    }
  };

  const handleAddNew = () => {
    navigate('/register/e-Mails Relatório');
  };

  return (
    <TooltipProvider>
      <div className={`w-[100dvw] h-[100dvh] flex justify-center items-center ${isDarkMode ? 'bg-[#353535]' : 'bg-[#F3F7FE]'} ${isMobile ? 'pt-[100px]' : ''}`}>
        <div className={`flex flex-col justify-between h-full py-7 ${isMobile ? 'gap-3' : 'gap-7'} `}>
          <h2 className={`text-xl absolute font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'} ${isMobile ? 'text-center w-[100%] justify-center items-center relative mb-3' : ''}`}>Detalhes do {title}</h2>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleEdit}
              className={`px-4 py-1.5 text-xs rounded-full flex items-center gap-2 ${isDarkMode ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <Pencil size={14} /> Editar
            </button>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className={`px-4 py-1.5 text-xs rounded-full flex items-center gap-2 text-destructive ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <Trash2 size={14} /> Excluir
            </button>
            <button
              onClick={handleAddNew}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 text-xs rounded-full flex items-center gap-2"
            >
              <Plus size={14} /> {title}
            </button>
          </div>
          <div className={`${isMobile ? 'w-[90dvw]' : 'w-[70dvw]'} h-full flex rounded-xl shadow-2xl ${isMobile ? 'flex-col' : ''} overflow-hidden`}>
            {/* Sidebar */}
            {!isMobile && (
              <div className={`${isMobile ? 'w-[50vw]' : 'w-[13vw]'} p-4 flex flex-col items-center`}>
                <div className={`flex items-center cursor-pointer justify-center gap-4 p-3 rounded-xl ${isDarkMode ? 'bg-zinc-600' : 'bg-[#D5E6FF]'} w-full`}>
                  <PencilIcon className={isDarkMode ? 'text-gray-200' : 'text-[#656565]'} size={16} />
                  <h2 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Dados Cadastrais</h2>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={`flex-1 ${isMobile ? 'p-5' : 'p-8'} flex justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-[#fff]'}`}>
              <div className='w-full max-w-[900px]'>
                <h1 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Dados Cadastrais</h1>
                <div className='justify-between flex flex-col h-full pb-10'>
                  <div
                    className={`rounded-xl relative p-6 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'} ${isDarkMode ? '' : 'shadow-md'}`}
                    style={isDarkMode ? { boxShadow: '0 2px 4px rgba(255, 255, 255, 0.2)' } : undefined}
                  >
                    <Edit
                      size={20}
                      className='cursor-pointer absolute text-gray-300 right-5 top-5 hover:text-gray-100 transition-colors'
                      onClick={handleEdit}
                    />
                    <h2 className={`text-base font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Identificação</h2>

                    <div className={`grid ${isMobile ? '' : 'grid-cols-4'} gap-4`}>
                      {fieldConfigs.map((field) => (
                        <div key={field.name} className={`col-span-${field.colSpan || 1}`}>
                          <label className={`text-xs block ${isMobile ? '' : ''}  ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>
                            {field.label}
                          </label>
                          <TooltipRoot delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  'w-full text-sm py-2 border border-transparent cursor-default',
                                  'overflow-hidden text-ellipsis whitespace-nowrap',
                                  isDarkMode ? 'text-gray-100' : 'text-[#656565]'
                                )}
                              >
                                {field.name === 'active'
                                  ? reportData[field.name] ? 'Sim' : 'Não'
                                  : reportData[field.name] || '-'}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className={isDarkMode ? 'bg-zinc-700 text-gray-200' : 'bg-white text-black border'}>
                              {field.name === 'active'
                                ? reportData[field.name] ? 'Sim' : 'Não'
                                : reportData[field.name] || '-'}
                            </TooltipContent>
                          </TooltipRoot>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className={isDarkMode ? 'bg-zinc-800 border-zinc-700 w-[90dvw] rounded-lg' : 'w-[90dvw] rounded-lg'}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDarkMode ? 'text-gray-200' : ''}>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={isDarkMode ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600' : ''}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};