/* =========================================================
   projetos.js - dados de origem dos cards de projetos
   Simula a resposta de uma API: um array de objetos.
   Para adicionar um projeto, basta incluir um objeto aqui;
   nenhuma linha de HTML precisa ser escrita.
   ========================================================= */

export const projetos = [
  {
    id: 'voluntariado',
    titulo: 'Voluntariado',
    badge: { texto: 'Vagas abertas', tipo: 'sucesso' },
    descricao: 'Pessoas interessadas podem participar das atividades voluntárias da organização.',
    itens: ['Apoio em campanhas sociais', 'Distribuição de alimentos', 'Organização de eventos'],
    acao: { tipo: 'link', texto: 'Quero ser voluntário', destino: '#/cadastro' },
  },
  {
    id: 'doacoes',
    titulo: 'Campanhas de doação',
    badge: { texto: 'Urgente', tipo: 'erro' },
    descricao: 'As doações ajudam a manter os projetos sociais e ampliar o atendimento realizado pela ONG.',
    itens: ['Doação financeira', 'Doação de alimentos', 'Doação de materiais'],
    acao: { tipo: 'modal', texto: 'Ver dados para doação', destino: 'modal-doacao' },
  },
  {
    id: 'contribuir',
    titulo: 'Como contribuir',
    badge: { texto: 'Novo', tipo: 'info' },
    descricao: 'Para participar das ações ou contribuir com a organização, acesse a página de cadastro.',
    itens: [],
    acao: { tipo: 'link', texto: 'Quero contribuir', destino: '#/cadastro' },
  },
  {
    id: 'oficinas',
    titulo: 'Oficinas educativas',
    badge: { texto: 'Últimos dias', tipo: 'aviso' },
    descricao: 'Oficinas gratuitas de informática básica e educação financeira para a comunidade.',
    itens: ['Informática básica', 'Educação financeira', 'Preparação para entrevistas'],
    acao: { tipo: 'link', texto: 'Inscrever-se', destino: '#/cadastro' },
  },
  {
    id: 'apoio-escolar',
    titulo: 'Apoio escolar',
    badge: { texto: 'Vagas abertas', tipo: 'sucesso' },
    descricao: 'Reforço escolar para crianças e adolescentes no contraturno, com voluntários e educadores.',
    itens: ['Matemática', 'Leitura e escrita', 'Acompanhamento das tarefas'],
    acao: null,
  },
  {
    id: 'horta',
    titulo: 'Horta comunitária',
    badge: { texto: 'Encerrado', tipo: 'neutro' },
    descricao: 'Projeto de cultivo coletivo de hortaliças, concluído nesta temporada.',
    itens: ['Mutirões de plantio', 'Colheita compartilhada'],
    acao: null,
  },
];
