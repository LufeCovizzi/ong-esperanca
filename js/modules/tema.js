/* =========================================================
   tema.js - troca de tema (automático, claro, escuro, alto contraste)
   O CSS define as cores de cada tema em variáveis. Este módulo só
   coloca (ou retira) o atributo data-tema no <html> e salva a escolha.
   "Automático" = sem atributo: o CSS segue o prefers-color-scheme
   (claro ou escuro) do sistema operacional.
   ========================================================= */

import { salvar, carregar } from '../services/storage.js';

const CHAVE_TEMA = 'tema';
const TEMAS = ['sistema', 'claro', 'escuro', 'contraste'];

function aplicarTema(tema) {
  const raiz = document.documentElement;
  if (tema === 'sistema') {
    delete raiz.dataset.tema;              // remove data-tema: vale a preferência do sistema
  } else {
    raiz.dataset.tema = tema;              // vira <html data-tema="escuro">
  }
  // Avisa quem desenha com cores próprias (ex.: o gráfico) para se atualizar
  document.dispatchEvent(new CustomEvent('tema:alterado', { detail: { tema } }));
}

export function iniciarTema() {
  const seletor = document.querySelector('#tema');
  if (!seletor) return;

  const salvo = carregar(CHAVE_TEMA, 'sistema');
  seletor.value = TEMAS.includes(salvo) ? salvo : 'sistema';

  // CHANGE: o usuário escolheu outro tema no <select>
  seletor.addEventListener('change', () => {
    aplicarTema(seletor.value);
    salvar(CHAVE_TEMA, seletor.value);
  });

  // No modo automático, reage se o sistema mudar entre claro e escuro
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (seletor.value === 'sistema') aplicarTema('sistema');
  });
}
