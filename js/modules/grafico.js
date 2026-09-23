/* =========================================================
   grafico.js - integração com a biblioteca Chart.js (via CDN)

   Cuidados da integração:
   1) Escopo: a biblioteca é importada como MÓDULO ES (versão "+esm").
      Nada é criado no escopo global (window.Chart não existe),
      então não há conflito com o restante do código.
   2) Carregamento: import() DINÂMICO. O arquivo só é baixado
      quando a página inicial é aberta, e só uma vez (cache).
   3) Falha: se a CDN não responder (ex.: sem internet), o
      try/catch mostra a tabela de dados no lugar do gráfico.
   4) SPA: ao sair e voltar para a rota, o gráfico anterior é
      destruído (destroy) antes de criar outro.
   ========================================================= */

import { impacto } from '../data/impacto.js';

// Versão fixada: uma atualização da biblioteca não quebra o site sem aviso
const URL_CHARTJS = 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/+esm';

let Chart = null;     // guarda a classe depois do primeiro carregamento
let grafico = null;   // instância atual do gráfico

async function carregarChartJs() {
  if (Chart) return Chart;                        // já carregada: reaproveita
  const modulo = await import(URL_CHARTJS);       // baixa a biblioteca sob demanda
  modulo.Chart.register(...modulo.registerables); // ativa tipos de gráfico, eixos e legendas
  Chart = modulo.Chart;
  return Chart;
}

// Lê uma variável CSS (ex.: --verde) para o gráfico seguir a paleta do site
function corCss(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

// Tabela com os mesmos dados: alternativa acessível e plano B se a CDN falhar
function preencherTabela(tabela) {
  const linhas = impacto.anos.map((ano, i) => {
    const tr = document.createElement('tr');
    [ano, impacto.familias[i], impacto.voluntarios[i]].forEach((valor, coluna) => {
      const celula = document.createElement(coluna === 0 ? 'th' : 'td');
      if (coluna === 0) celula.scope = 'row';
      celula.textContent = valor;
      tr.append(celula);
    });
    return tr;
  });
  tabela.querySelector('tbody').replaceChildren(...linhas);
}

async function desenharGrafico() {
  const canvas = document.querySelector('#grafico-impacto');
  if (!canvas) return;

  preencherTabela(document.querySelector('#tabela-impacto'));

  try {
    const ChartJs = await carregarChartJs();
    if (!canvas.isConnected) return;   // o usuário saiu da página enquanto carregava

    grafico?.destroy();                 // remove o gráfico da visita anterior

    const semAnimacao = matchMedia('(prefers-reduced-motion: reduce)').matches;

    grafico = new ChartJs(canvas, {
      type: 'bar',
      data: {
        labels: impacto.anos,
        datasets: [
          { label: 'Famílias atendidas', data: impacto.familias, backgroundColor: corCss('--verde'), borderRadius: 6 },
          { label: 'Voluntários ativos', data: impacto.voluntarios, backgroundColor: corCss('--info'), borderRadius: 6 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,          // a altura vem do CSS (.grafico)
        animation: semAnimacao ? false : { duration: 800 },
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } },
      },
    });
  } catch (erro) {
    console.error('Chart.js não carregou:', erro);
    document.querySelector('.grafico')?.remove();
    document.querySelector('#impacto-alerta').hidden = false;
    document.querySelector('#impacto-detalhes').open = true;   // abre a tabela
  }
}

export function iniciarGrafico() {
  document.addEventListener('rota:carregada', (evento) => {
    if (evento.detail.rota === 'inicio') desenharGrafico();
  });
}
