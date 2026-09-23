/* =========================================================
   menu.js - menu responsivo
   O abrir/fechar visual do hambúrguer é feito em CSS (checkbox + :checked).
   O JavaScript complementa com acessibilidade e com o fechamento
   automático, necessário porque na SPA a página não recarrega.
   ========================================================= */

export function iniciarMenu() {
  const toggle = document.querySelector('.menu-toggle');
  if (!toggle) return;
  const textoBotao = document.querySelector('.menu-icone .sr-only');

  function fechar() {
    toggle.checked = false;
    textoBotao.textContent = 'Abrir menu';
  }

  // CHANGE: o checkbox mudou de estado -> atualiza o texto lido pelo leitor de tela
  toggle.addEventListener('change', () => {
    textoBotao.textContent = toggle.checked ? 'Fechar menu' : 'Abrir menu';
  });

  // HASHCHANGE: o usuário navegou -> fecha o menu no celular
  window.addEventListener('hashchange', fechar);

  // KEYDOWN: tecla Esc fecha o menu se estiver aberto
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && toggle.checked) fechar();
  });
}
