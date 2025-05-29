import React from 'react';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, PencilIcon, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../App';

const fieldConfigs = [
  { name: 'projeto', label: 'Projeto', placeholder: 'Insira o Projeto', type: 'text', colSpan: 1, validation: z.string().min(1, 'Projeto é obrigatório'), defaultValue: '' },
  { name: 'email', label: 'e-Mail', placeholder: 'Insira o e-Mail', type: 'text', colSpan: 1, validation: z.string().email('Email inválido'), defaultValue: '' },
  { name: 'nome', label: 'Nome Completo', placeholder: 'Insira o Nome Completo', type: 'text', colSpan: 1, validation: z.string().min(1, 'Nome é obrigatório'), defaultValue: '' },
  { name: 'ativo', label: 'Ativo', type: 'checkbox', colSpan: 1, validation: z.boolean().default(true), defaultValue: true },
] as const;

const schemaShape: Record<string, z.ZodTypeAny> = {};
const defaultValues: Record<string, unknown> = {};

fieldConfigs.forEach((field) => {
  schemaShape[field.name] = field.validation;
  defaultValues[field.name] = field.defaultValue;
});

const formSchema = z.object(schemaShape);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const editMode = location.state?.editMode;
  const reportData = location.state?.reportData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editMode ? {
      projeto: reportData.project,
      email: reportData.email,
      nome: reportData.name,
      ativo: reportData.active,
    } : defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editMode) {
        const { error } = await supabase
          .from('email_reports')
          .update({
            project: values.projeto,
            email: values.email,
            name: values.nome,
            active: values.ativo,
          })
          .eq('id', reportData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('email_reports')
          .insert([{
            project: values.projeto,
            email: values.email,
            name: values.nome,
            active: values.ativo,
          }]);

        if (error) throw error;
      }

      navigate('/control/e-Mails Relatório');
    } catch (error) {
      console.error('Error saving email report:', error);
    }
  };

  return (
    <div className={`w-[100dvw] h-[100dvh] flex justify-center items-center ${isDarkMode ? 'bg-zinc-900' : 'bg-[#F3F7FE]'}`}>
      <div className='flex flex-col justify-between h-full py-7 gap-7'>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Criar e-Mail</h2>
        <div className="w-[70dvw] h-full flex rounded-xl shadow-md overflow-hidden">
          {/* Sidebar */}
          <div className={`w-[13vw] p-4 border-r ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-[#F8F8F8] border-[#fff]'} flex flex-col items-center`}>
            <div className={`flex items-center justify-center gap-4 p-3 rounded-xl ${isDarkMode ? 'bg-zinc-700' : 'bg-[#D5E6FF]'} w-full`}>
              <PencilIcon className={isDarkMode ? 'text-gray-200' : 'text-[#656565]'} size={16} />
              <h2 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Dados Cadastrais</h2>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 p-8 flex justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-[#fff]'}`}>
            <div className="w-full max-w-[900px]">
              <h1 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Dados Cadastrais</h1>
              <div className='justify-between flex flex-col h-full pb-10'>
                <div className={`rounded-xl p-6 shadow-md ${isDarkMode ? 'bg-zinc-700' : 'bg-white'}`}>
                  <h2 className={`text-base font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>Identificação</h2>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-4 gap-4">
                        {fieldConfigs.map((fieldConfig) => (
                          <FormField
                            key={fieldConfig.name}
                            control={form.control}
                            name={fieldConfig.name as keyof z.infer<typeof formSchema>}
                            render={({ field }) => (
                              <FormItem className={`col-span-${fieldConfig.colSpan || 1}`}>
                                {fieldConfig.type === 'checkbox' ? (
                                  <div className="flex items-end pb-1">
                                    <div className="flex flex-col items-center h-full">
                                      <FormLabel className={`ml-2 font-bold text-xs mt-1 ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>{fieldConfig.label}</FormLabel>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className={`h-4 w-4 mt-4 rounded border ${isDarkMode ? 'bg-zinc-600 border-zinc-500' : 'border-gray-300'}`}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <FormLabel className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-[#656565]'}`}>{fieldConfig.label}</FormLabel>
                                    <FormControl>
                                      <input
                                        {...field}
                                        placeholder={fieldConfig.placeholder}
                                        className={`w-full text-sm px-3 py-1 rounded-full border ${
                                          isDarkMode 
                                            ? 'bg-zinc-800 border-zinc-600 text-gray-200 placeholder-gray-400' 
                                            : 'border-gray-300 bg-white'
                                        }`}
                                      />
                                    </FormControl>
                                  </>
                                )}
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </form>
                  </Form>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className={`px-3 py-1.5 text-sm rounded-full ${
                      isDarkMode 
                        ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600' 
                        : 'bg-[#F3F4F6] text-[#656565] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    <X size={14} className="inline-block mr-1" />
                    Cancelar
                  </button>
                  <button
                    onClick={form.handleSubmit(onSubmit)}
                    className="px-3 py-1.5 text-sm rounded-full bg-[#4D94FF] text-white hover:bg-[#3B82F6]"
                  >
                    <Check size={14} className="inline-block mr-1" />
                    {editMode ? 'Salvar' : 'Concluir'}
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