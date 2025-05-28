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
  { id: 'notificacoes', label: 'Tipo Notificações', icon: 'bell', options: ['cadastro', 'consultar'] }
];

export const controlOptionsLabels: Record<string, string> = {
  'cadastro': 'Cadastro',
  'consultar': 'Consultar',
  'faces': 'Faces',
  'placas': 'Placas'
};

export const locationPins = [
  { id: 1, label: "UBS", count: 11, color: "#5db0eb", items: [
    { id: 'ubs1', name: 'UBS Jardim Esperança', coordinates: '-23.5505, -46.6333' },
    { id: 'ubs2', name: 'UBS Nova Aliança', coordinates: '-23.5505, -46.6333' },
    { id: 'ubs3', name: 'UBS Saúde para Todos', coordinates: '-23.5505, -46.6333' },
    { id: 'ubs4', name: 'UBS Bem Viver', coordinates: '-23.5505, -46.6333' }
  ]},
  { id: 2, label: "Hospitais", count: 21, color: "#bf2424", items: [
    { id: 'hosp1', name: 'Hospital Vida e Saúde', coordinates: '-23.5505, -46.6333' },
    { id: 'hosp2', name: 'Hospital São Lucas', coordinates: '-23.5505, -46.6333' },
    { id: 'hosp3', name: 'Hospital Municipal Nossa...', coordinates: '-23.5505, -46.6333' },
    { id: 'hosp4', name: 'Hospital Esperança de Viver', coordinates: '-23.5505, -46.6333' }
  ]},
  { id: 3, label: "Praças e Parques", count: 14, color: "#529319", items: [
    { id: 'praca1', name: 'Praça das Palmeiras', coordinates: '-23.5505, -46.6333' },
    { id: 'praca2', name: 'Praça do Sol', coordinates: '-23.5505, -46.6333' },
    { id: 'praca3', name: 'Praça da Liberdade', coordinates: '-23.5505, -46.6333' },
    { id: 'praca4', name: 'Praça São Jorge', coordinates: '-23.5505, -46.6333' }
  ]}
];

export const menuItems = [
  { id: "monitoramento", label: "Monitoramento", badge: 15 },
  { id: "controle", label: "Controle" },
  { id: "historico", label: "Histórico de Vídeos" },
  { id: "estatisticas", label: "Estatísticas" },
];

export const bottomNavItems = [
  { id: "notifications", label: "Notificações" },
  { id: "location", label: "Localização" },
  { id: "darkMode", label: "Modo Escuro" },
  { id: "logout", label: "Sair" },
];