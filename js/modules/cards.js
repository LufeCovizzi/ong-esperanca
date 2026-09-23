/* =========================================================
   cards.js - sistema de templates dos cards de projetos
   Dados (js/data/projetos.js) + molde (<template> no HTML)
   -> um card clonado e preenchido para cada projeto.
   ========================================================= */

import { projetos } from '../data/projetos.js';

// Cria UM card a partir de UM objeto de dados
function criarCard(projeto, template) {
  // 1. Clona o molde (true = cópia profunda, com todos os filhos)
  const card = template.content.firstElementChild.cloneNode(true);

  // 2. Preenche com os dados. textContent insere TEXTO puro:
  //    se o dado tiver "<script>", ele aparece como texto e não executa
  card.id = projeto.id;  // âncora usada pelo submenu (#/projetos/doacoes)
  card.dataset.tipo = projeto.badge.tipo;  // vira data-tipo="...", usado pelos filtros
  card.querySelector('.card__titulo').textContent = projeto.titulo;
  card.querySelector('.card__descricao').textContent = projeto.descricao;

  const badge = card.querySelector('.badge');
  badge.textContent = projeto.badge.texto;
  badge.classList.add(`badge--${projeto.badge.tipo}`);  // template literal monta a classe

  // 3. Lista de itens: map() transforma cada texto em um <li>
  const lista = card.querySelector('.card__itens');
  if (projeto.itens.length > 0) {
    const itens = projeto.itens.map((texto) => {
      const li = document.createElement('li');
      li.textContent = texto;
      return li;
    });
    lista.append(...itens);  // "..." espalha o array em vários argumentos
  } else {
    lista.remove();          // sem itens: remove a <ul> vazia
  }

  // 4. Ação do card: link, botão de modal ou nenhuma
  const areaAcao = card.querySelector('.card__acao');
  if (projeto.acao) {
    areaAcao.append(criarAcao(projeto.acao));
  } else {
    areaAcao.remove();
  }

  return card;
}

// Cria o elemento de ação conforme o tipo definido nos dados
function criarAcao(acao) {
  let elemento;
  if (acao.tipo === 'modal') {
    elemento = document.createElement('button');
    elemento.type = 'button';
    elemento.setAttribute('popovertarget', acao.destino);  // abre o modal nativo
  } else {
    elemento = document.createElement('a');
    elemento.href = acao.destino;
  }
  elemento.className = 'botao';
  elemento.textContent = acao.texto;
  return elemento;
}

// Gera todos os cards e coloca no contêiner de uma só vez
export function renderizarCards(lista, container, template) {
  // DocumentFragment: "caixa" fora da tela; os cards são montados nela
  // e inseridos no DOM numa única operação (a página redesenha uma vez só)
  const fragmento = document.createDocumentFragment();
  lista.forEach((projeto) => fragmento.append(criarCard(projeto, template)));
  container.replaceChildren(fragmento);  // limpa o conteúdo antigo e insere o novo
}

export function iniciarCards() {
  // Os cards só existem na rota "projetos", que é injetada pelo router
  document.addEventListener('rota:carregada', (evento) => {
    if (evento.detail.rota !== 'projetos') return;

    const container = document.querySelector('#lista-projetos');
    const template = document.querySelector('#tpl-card-projeto');
    if (!container || !template) return;

    renderizarCards(projetos, container, template);
    document.dispatchEvent(new CustomEvent('cards:renderizados'));
  });
}
