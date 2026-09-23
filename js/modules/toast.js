/* =========================================================
   toast.js - notificações temporárias
   ========================================================= */

let temporizador;

export function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.querySelector('#toast');
  if (!toast) return;

  toast.querySelector('.toast__mensagem').textContent = mensagem;  // textContent: não interpreta HTML
  toast.className = `toast toast--${tipo} toast--visivel`;

  clearTimeout(temporizador);                                // reinicia a contagem se já estava aberto
  temporizador = setTimeout(esconderToast, 5000);
}

function esconderToast() {
  document.querySelector('#toast')?.classList.remove('toast--visivel');
}

export function iniciarToast() {
  const botaoFechar = document.querySelector('#toast .toast__fechar');
  if (!botaoFechar) return;
  botaoFechar.addEventListener('click', esconderToast);
}
