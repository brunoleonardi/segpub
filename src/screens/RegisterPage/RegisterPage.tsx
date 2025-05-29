import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, PencilIcon } from 'lucide-react';

const formSchema = z.object({
  projeto: z.string().min(1, 'Projeto é obrigatório'),
  email: z.string().email('Email inválido'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean().default(true)
});

export const RegisterPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { section } = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projeto: '',
      email: '',
      nome: '',
      ativo: true
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-[#EFF4FA]'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-[300px] h-screen p-4 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
          <button 
            onClick={() => navigate('/')}
            className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-zinc-700 text-gray-300 hover:bg-zinc-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            isDarkMode ? 'bg-zinc-700' : 'bg-blue-600/5'
          }`}>
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-zinc-600' : 'bg-blue-500'
            }`}>
              <PencilIcon size={20} className="text-white" />
            </div>
            <div>
              <h2 className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Dados Cadastrais
              </h2>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Informações básicas
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-200' : ''}`}>
            <h1 className="text-2xl font-semibold mb-6">Criar {section}</h1>

            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-zinc-800' : 'bg-white'}`}>
              <h2 className="text-lg font-medium mb-4">Identificação</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="projeto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={isDarkMode ? 'text-gray-300' : ''}>
                              Projeto
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                placeholder="Insira o Projeto"
                                className={`w-full p-2 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                                    : 'border-gray-200'
                                }`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={isDarkMode ? 'text-gray-300' : ''}>
                              e-Mail
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                placeholder="Insira o e-Mail"
                                className={`w-full p-2 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                                    : 'border-gray-200'
                                }`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={isDarkMode ? 'text-gray-300' : ''}>
                              Nome Completo
                            </FormLabel>
                            <FormControl>
                              <input
                                {...field}
                                placeholder="Insira o Nome Completo"
                                className={`w-full p-2 rounded-lg border ${
                                  isDarkMode 
                                    ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                                    : 'border-gray-200'
                                }`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className={`h-4 w-4 rounded ${
                                  isDarkMode 
                                    ? 'text-blue-500 bg-zinc-700 border-zinc-600' 
                                    : 'text-blue-600 bg-gray-100 border-gray-200'
                                }`}
                              />
                              <FormLabel className={isDarkMode ? 'text-gray-300' : ''}>
                                Ativo
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className={`px-4 py-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Concluir
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};