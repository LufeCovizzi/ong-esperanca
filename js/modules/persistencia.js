/* =========================================================
   persistencia.js - rascunho e histórico do cadastro
   - rascunho (objeto): salvo a cada tecla e restaurado ao voltar
   - histórico (array): cadastros enviados neste navegador
   ========================================================= */

import { salvar, carregar, remover } from '../services/storage.js';
import { mostrarToast } from './toast.js';

const CHAVE_RASCUNHO = 'rascunhoCadastro';
const CHAVE_HISTORICO = 'historicoCadastros';
const LIMITE_HISTORICO = 5;

// ---------- Rascunho ----------

// Transforma os campos do formulário em um objeto { nome: '...', email: '...' }
function lerCampos(form) {
  return Object.fromEntries(new FormData(form));
}

function salvarRascunho(form) {
  salvar(CHAVE_RASCUNHO, lerCampos(form));
}

function restaurarRascunho(form) {
  const rascunho = carregar(CHAVE_RASCUNHO, null);
  if (!rascunho) return;

  let preenchidos = 0;
  // Object.entries transforma o objeto em pares [nome, valor]
  Object.entries(rascunho).forEach(([nome, valor]) => {
    const campo = form.elements[nome];
    if (campo && valor) {
      campo.value = valor;
      preenchidos++;
    }
  });
  if (preenchidos > 0) mostrarToast('Rascunho restaurado: continue de onde parou.', 'info');
}

function descartarRascunho() {
  remover(CHAVE_RASCUNHO);
}

// ---------- Histórico ----------

function registrarCadastro(dados) {
  const historico = carregar(CHAVE_HISTORICO, []);   // array vazio se ainda não existe

  // unshift coloca o novo no início; slice mantém só os 5 mais recentes.
  // Guardamos só o necessário para exibir (sem e-mail, endereço etc.)
  historico.unshift({ nome: dados.nome, cidade: dados.cidade, data: new Date().toISOString() });
  salvar(CHAVE_HISTORICO, historico.slice(0, LIMITE_HISTORICO));
  renderizarHistorico();
}

function renderizarHistorico() {
  const secao = document.querySelector('#historico');
  if (!secao) return;

  const historico = carregar(CHAVE_HISTORICO, []);
  secao.hidden = historico.length === 0;             // sem histórico: esconde a seção

  const lista = secao.querySelector('.historico__lista');
  const itens = historico.map((cadastro) => {
    const li = document.createElement('li');
    const data = new Date(cadastro.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    li.textContent = `${cadastro.nome} (${cadastro.cidade}) - ${data}`;
    return li;
  });
  lista.replaceChildren(...itens);
}

// ---------- Eventos ----------

export function iniciarPersistencia() {
  // Ao abrir a rota de cadastro: restaura o rascunho e desenha o histórico
  document.addEventListener('rota:carregada', (evento) => {
    if (evento.detail.rota !== 'cadastro') return;
    const form = document.querySelector('.formulario');
    if (form) restaurarRascunho(form);
    renderizarHistorico();
  });

  // A cada tecla no formulário: grava o rascunho
  document.addEventListener('input', (evento) => {
    const form = evento.target.closest?.('.formulario');
    if (form) salvarRascunho(form);
  });

  // Cadastro enviado (evento disparado pelo formulario.js):
  // registra no histórico e apaga o rascunho
  document.addEventListener('cadastro:enviado', (evento) => {
    registrarCadastro(evento.detail.dados);
    descartarRascunho();
  });

  // Botão "Limpar histórico" (delegação de eventos)
  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('.historico__limpar')) return;
    remover(CHAVE_HISTORICO);
    renderizarHistorico();
    mostrarToast('Histórico apagado deste navegador.', 'info');
  });
}
