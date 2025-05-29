import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, PencilIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  projeto: z.string().min(1, 'Projeto é obrigatório'),
  email: z.string().email('Email inválido'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean().default(true),
});

interface RegisterPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkMode?: boolean;
  section: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ open, onOpenChange, isDarkMode, section }) => {
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projeto: '',
      email: '',
      nome: '',
      ativo: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    onOpenChange(false);
  };

  return (
    <div className='w-[100dvw] h-[100dvh] flex justify-center items-center bg-[#F3F7FE]'>
      <div className="w-[70-dvw] h-[70dvh] flex rounded-xl shadow-md overflow-hidden">
        {/* Sidebar */}
        <div className="w-[13vw] p-4 bg-white border-r border-[#fff] bg-[#F8F8F8] flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 p-3 rounded-xl bg-[#D5E6FF] w-full">
            <PencilIcon className='text-[#656565]' size={16} />
            <h2 className="text-sm font-medium text-[#656565]">Dados Cadastrais</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#fff] p-8 flex justify-center">
          <div className="w-full max-w-[900px]">
            <h1 className="text-xl font-semibold mb-6 text-[#656565]">Dados Cadastrais</h1>
            <div className='justify-between flex flex-col h-full pb-10'>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-base font-semibold mb-6 text-[#656565]">Identificação</h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="projeto"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs text-[#656565]">Projeto</FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                placeholder="Insira o Projeto"
                                className="w-full text-sm px-3 py-1 rounded-full border border-gray-300 bg-white"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs text-[#656565]">e-Mail</FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                placeholder="Insira o e-Mail"
                                className="w-full text-sm px-3 py-1 rounded-full border border-gray-300 bg-white"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs text-[#656565]">Nome Completo</FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                placeholder="Insira o Nome Completo"
                                className="w-full text-sm px-3 py-1 rounded-full border border-gray-300 bg-white"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                          <FormItem className="col-span-1 flex items-end pb-1">
                            <div className="flex flex-col items-center h-full">
                              <FormLabel className="ml-2 font-bold text-xs mt-1 text-[#656565]">Ativo</FormLabel>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 mt-4 text-blue-600 rounded border border-gray-300"
                              />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-3 py-1.5 text-sm rounded-full bg-[#F3F4F6] text-[#656565] hover:bg-[#E5E7EB]"
                >
                  <X size={14} className="inline-block mr-1" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm rounded-full bg-[#4D94FF] text-white hover:bg-[#3B82F6]"
                >
                  <Check size={14} className="inline-block mr-1" />
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
