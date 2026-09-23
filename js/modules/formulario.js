/* =========================================================
   formulario.js - eventos do formulário de cadastro
   Como o formulário é injetado pelo router depois que a página
   carrega, os eventos são ouvidos no document (delegação).
   ========================================================= */

import { mostrarToast } from './toast.js';
import { validarFormulario, limparValidacao } from './validacao.js';

// Evento INPUT: ajusta o valor em tempo real (máscaras)
function tratarDigitacao(evento) {
  const campo = evento.target;

  if (campo.id === 'cep') {
    campo.value = campo.value.replace(/\D/g, '');                     // só dígitos
  }
  if (campo.id === 'estado') {
    campo.value = campo.value.replace(/[^a-z]/gi, '').toUpperCase();  // só letras, maiúsculas
  }
}

// Evento SUBMIT: valida tudo antes de aceitar o envio
function tratarEnvio(evento) {
  const form = evento.target;
  if (!form.matches('.formulario')) return;

  evento.preventDefault();                   // a SPA controla o fluxo (sem recarregar)

  const botao = form.querySelector('button[type="submit"]');
  if (botao.disabled) return;                // envio já em andamento: ignora cliques repetidos

  const camposComErro = validarFormulario(form);

  if (camposComErro.length > 0) {
    camposComErro[0].focus();                // leva o usuário ao primeiro erro
    const total = camposComErro.length;
    mostrarToast(`Corrija ${total} ${total === 1 ? 'campo destacado' : 'campos destacados'} para continuar.`, 'erro');
    return;                                  // interrompe: nada é enviado
  }

  // Avisa o restante da aplicação que um cadastro válido foi enviado.
  // O formulário NÃO sabe quem vai ouvir (hoje, o persistencia.js grava
  // no localStorage; amanhã, um módulo de API poderia enviar ao back-end).
  const dados = Object.fromEntries(new FormData(form));
  document.dispatchEvent(new CustomEvent('cadastro:enviado', { detail: { dados } }));

  mostrarToast('Cadastro enviado! Em breve entraremos em contato.');
  form.reset();
  limparValidacao(form);

  // Correção do duplo clique: o botão fica desabilitado por 2 segundos
  // (estilo :disabled do CSS), impedindo que um 2º clique valide o
  // formulário já vazio e mostre 7 erros no lugar da mensagem de sucesso
  botao.disabled = true;
  botao.textContent = 'Enviado!';
  setTimeout(() => {
    botao.disabled = false;
    botao.textContent = 'Enviar cadastro';
  }, 2000);
}

export function iniciarFormulario() {
  document.addEventListener('input', tratarDigitacao);
  document.addEventListener('submit', tratarEnvio);
}
