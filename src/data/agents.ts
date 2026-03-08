import { Agent } from '@/types/agent';

export const agents: Agent[] = [
  {
    id: 'research',
    name: 'Pesquisador',
    description: 'Pesquisa informações, reúne dados, resume conteúdos e compara fontes',
    icon: '🔍',
    capabilities: ['Pesquisa web', 'Resumo de artigos', 'Análise de dados', 'Fact-checking'],
  },
  {
    id: 'coder',
    name: 'Programador',
    description: 'Cria, analisa, revisa e depura código em qualquer linguagem',
    icon: '⚡',
    capabilities: ['Criação de código', 'Debug', 'Arquitetura', 'Code review'],
  },
  {
    id: 'business',
    name: 'Estrategista',
    description: 'Análise de mercado, estratégias de negócio e planejamento de startups',
    icon: '📊',
    capabilities: ['Análise de mercado', 'Planejamento', 'Monetização', 'Pitch decks'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Campanhas, copywriting, estratégias de crescimento e funis de vendas',
    icon: '🚀',
    capabilities: ['Campanhas', 'Copywriting', 'Growth', 'Funis de vendas'],
  },
  {
    id: 'content',
    name: 'Criador',
    description: 'Criação de artigos, roteiros, posts, scripts de vídeo e copywriting',
    icon: '✍️',
    capabilities: ['Artigos', 'Redes sociais', 'Roteiros', 'Scripts de vídeo'],
  },
  {
    id: 'analyst',
    name: 'Analista',
    description: 'Interpreta dados, cria relatórios, identifica padrões e tendências',
    icon: '📈',
    capabilities: ['Relatórios', 'Padrões', 'Métricas', 'Dashboards'],
  },
  {
    id: 'automation',
    name: 'Automação',
    description: 'Cria fluxos automáticos, integra APIs e automatiza processos',
    icon: '🤖',
    capabilities: ['Workflows', 'APIs', 'Automação', 'Integrações'],
  },
];
