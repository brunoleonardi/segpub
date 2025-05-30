import { ChevronLeft, Edit, PencilIcon, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

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

    const handleEdit = () => {
        navigate(`/register/e-Mails Relatório`, {
            state: {
                editMode: true,
                reportData: {
                    id: reportData.id,
                    project: reportData.project,
                    email: reportData.email,
                    name: reportData.name,
                    active: reportData.active
                }
            }
        });
    };

    return (
        <div className={`w-[100dvw] h-[100dvh] flex justify-center items-center ${isDarkMode ? 'bg-[#353535]' : 'bg-[#F3F7FE]'}`}>
            <div className='flex flex-col justify-between h-full py-7 gap-7'>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Detalhes do e-Mail</h2>
                <div className="w-[70dvw] h-full flex rounded-xl shadow-2xl overflow-hidden">
                    {/* Sidebar */}
                    <div className={`w-[13vw] p-4 ${isDarkMode ? 'bg-[#333333]' : 'bg-[#F8F8F8]'} flex flex-col items-center`}>
                        <div className={`flex items-center justify-center gap-4 p-3 rounded-xl ${isDarkMode ? 'bg-zinc-600' : 'bg-[#D5E6FF]'} w-full`}>
                            <PencilIcon className={isDarkMode ? 'text-gray-200' : 'text-[#656565]'} size={16} />
                            <h2 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Dados Cadastrais</h2>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className={`flex-1 p-8 flex justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-[#fff]'}`}>
                        <div className="w-full max-w-[900px]">
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

                                    <div className="grid grid-cols-4 gap-4">
                                        {fieldConfigs.map((field) => (
                                            <div key={field.name} className={`col-span-${field.colSpan || 1}`}>
                                                <label className={`text-xs block mb-1 ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>
                                                    {field.label}
                                                </label>
                                                <div className={`w-full text-sm py-2 ${isDarkMode ? 'text-gray-100' : 'text-[#656565]'} border border-transparent`}>
                                                    {field.name === 'active'
                                                        ? reportData[field.name] ? 'Sim' : 'Não'
                                                        : reportData[field.name] || '-'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/control/e-Mails Relatório')}
                                        className={`px-3 py-1.5 text-sm rounded-full ${isDarkMode
                                            ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600'
                                            : 'bg-[#F3F4F6] text-[#656565] hover:bg-[#E5E7EB]'
                                            }`}
                                    >
                                        <ChevronLeft size={14} className="inline-block mr-1 pb-0.5" />
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};