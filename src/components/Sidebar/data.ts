import { supabase } from '../../lib/supabase';

// Mock data structure for the monitoring section
export const monitoringData = {
  fixos: {
    label: "Fixos",
    items: [
      { id: 'fix1', label: 'Camera Fixa 1', status: 'online' },
      { id: 'fix2', label: 'Camera Fixa 2', status: 'offline', lastSeen: '01/11/24 15:10' }
    ]
  },
  veiculos: {
    label: "Veículos",
    items: {
      emTransito: {
        label: "Em Trânsito",
        items: [
          { id: 'ssbpa', label: 'SSBPA-P02', status: 'offline', lastSeen: '01/11/24 15:10' },
          { id: 't01', label: 'T01 - BANCADA', status: 'online' }
        ]
      },
      naBase: {
        label: "Na Base",
        items: [
          { id: 'cam1', label: 'Camera 1', status: 'online' },
          { id: 'cam2', label: 'Camera 2', status: 'online' }
        ]
      }
    }
  },
  offline: {
    label: "Offline",
    items: [
      { id: 'cam3', label: 'Camera 3', status: 'offline', lastSeen: '01/11/24 15:10' },
      { id: 'cam4', label: 'Camera 4', status: 'offline', lastSeen: '01/11/24 15:10' }
    ]
  }
};

export const controlData = [
  { id: 'usuarios', label: 'Usuários', icon: 'user', options: ['cadastro', 'consultar'] },
  { id: 'grupos', label: 'Grupos', icon: 'users', options: ['cadastro', 'consultar'] },
  { 
    id: 'procurados', 
    label: 'Procurados', 
    icon: 'search', 
    options: ['faces', 'placas'] 
  },
  { id: 'dispositivos', label: 'Dispositivos', icon: 'smartphone', options: ['cadastro', 'consultar'] },
  { id: 'itens-monitorados', label: 'Itens Monitorados', icon: 'monitor', options: ['cadastro', 'consultar'] },
  { id: 'clientes', label: 'Clientes', icon: 'building', options: ['cadastro', 'consultar'] },
  { id: 'emails', label: 'e-Mails Relatório', icon: 'mail', options: ['cadastro', 'consultar'] },
  { id: 'relatorios', label: 'Relatórios', icon: 'file-text', options: ['cadastro', 'consultar'] },
  { id: 'notificacoes', label: 'Tipo Notificação', icon: 'bell', options: ['cadastro', 'consultar'] }
];

export const controlOptionsLabels: Record<string, string> = {
  'cadastro': 'Cadastro',
  'consultar': 'Consultar',
  'faces': 'Faces',
  'placas': 'Placas'
};

export const menuItems = [
  { id: "monitoramento", label: "Monitoramento", badge: 15 },
  { id: "controle", label: "Controle" },
  { id: "historico", label: "Histórico de Vídeos" },
  { id: "estatisticas", label: "Estatísticas" },
];

export const bottomNavItems = [
  { id: "notifications", label: "Notificações" },
  { id: "home", label: "Página Inicial" },
  { id: "location", label: "Localização" },
  { id: "darkMode", label: "Modo Escuro" },
  { id: "logout", label: "Sair" },
];