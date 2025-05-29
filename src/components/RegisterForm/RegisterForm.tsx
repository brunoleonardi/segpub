import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

const formSchema = z.object({
  projeto: z.string().min(1, 'Projeto é obrigatório'),
  email: z.string().email('Email inválido'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean().default(true)
});

interface RegisterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkMode?: boolean;
  section: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  open, 
  onOpenChange, 
  isDarkMode,
  section 
}) => {
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`border-none rounded-2xl w-[400px] backdrop-blur-[2px] px-6 pt-5 shadow-md cursor-default z-50 ${
        isDarkMode ? 'bg-zinc-900/60' : 'bg-[#EFF4FA]/70'
      }`}>
        <DialogHeader>
          <DialogTitle className={`py-4 text-center ${isDarkMode ? 'text-gray-200' : ''}`}>
            Criar {section}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div>
                <FormField
                  control={form.control}
                  name="projeto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isDarkMode ? 'text-gray-300 text-sm' : 'text-sm'}>
                        Projeto
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Insira o Projeto"
                          className={`w-full mt-1.5 p-2 rounded-full text-sm ${
                            isDarkMode 
                              ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                              : 'border-gray-300'
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
                      <FormLabel className={isDarkMode ? 'text-gray-300 text-sm' : 'text-sm'}>
                        e-Mail
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Insira o e-Mail"
                          className={`w-full mt-1.5 p-2 rounded-full text-sm ${
                            isDarkMode 
                              ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                              : 'border-gray-300'
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
                      <FormLabel className={isDarkMode ? 'text-gray-300 text-sm' : 'text-sm'}>
                        Nome Completo
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Insira o Nome Completo"
                          className={`w-full mt-1.5 p-2 rounded-full text-sm ${
                            isDarkMode 
                              ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                              : 'border-gray-300'
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
                              : 'text-blue-600 bg-gray-100 border-gray-300'
                          }`}
                        />
                        <FormLabel className={isDarkMode ? 'text-gray-300 text-sm' : 'text-sm'}>
                          Ativo
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className={`px-3 py-2 text-destructive text-sm flex items-center justify-center gap-2 rounded-full ${
                  isDarkMode 
                    ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <X size={15} /> Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-2 flex items-center justify-center text-sm gap-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Concluir
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};