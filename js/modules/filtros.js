/* =========================================================
   filtros.js - filtra os cards de projetos por situação
   Evento: click, com DELEGAÇÃO. O listener fica no document
   (que sempre existe), e não em cada botão, porque os botões
   e os cards são injetados depois pelo router e pelo cards.js.
   ========================================================= */

import { salvar, carregar } from '../services/storage.js';

const CHAVE_FILTRO = 'filtroProjetos';

function aplicarFiltro(filtro) {
  const cards = document.querySelectorAll('#lista-projetos .card');
  let visiveis = 0;

  cards.forEach((card) => {
    const mostrar = filtro === 'todos' || card.dataset.tipo === filtro;
    card.hidden = !mostrar;          // atributo hidden esconde o card
    if (mostrar) visiveis++;
  });

  // Estado visual dos botões: aria-pressed="true" também é usado pelo CSS
  document.querySelectorAll('.filtro').forEach((botao) => {
    botao.setAttribute('aria-pressed', String(botao.dataset.filtro === filtro));
  });

  const contador = document.querySelector('#contador-projetos');
  if (contador) contador.textContent = `Mostrando ${visiveis} de ${cards.length} projetos`;
}

export function iniciarFiltros() {
  document.addEventListener('click', (evento) => {
    // closest() sobe na árvore do DOM a partir do elemento clicado
    // até achar um .filtro (funciona mesmo clicando no texto do botão)
    const botao = evento.target.closest('.filtro');
    if (!botao) return;              // o clique não foi num filtro: ignora
    aplicarFiltro(botao.dataset.filtro);
    salvar(CHAVE_FILTRO, botao.dataset.filtro);  // lembra a preferência
  });

  // Quando os cards são (re)gerados, reaplica o último filtro salvo (ou 'todos')
  document.addEventListener('cards:renderizados', () => {
    aplicarFiltro(carregar(CHAVE_FILTRO, 'todos'));
  });
}
