/* =========================================================
   validacao.js - verificação de consistência do cadastro
   Quando: ao sair do campo (focusout), enquanto corrige (input)
   e no envio (submit). Como: regras com RegEx + classes CSS +
   mensagens injetadas no DOM.
   ========================================================= */

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
             'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

// Cada regra recebe o valor e devolve uma MENSAGEM DE ERRO,
// ou uma string vazia ('') quando o valor está correto.
const regras = {
  nome(valor) {
    if (!valor) return 'Informe seu nome completo.';
    // Letras (com acento) + pelo menos um espaço seguido de outro nome
    if (!/^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)+$/.test(valor)) {
      return 'Digite nome e sobrenome, apenas com letras.';
    }
    return '';
  },
  email(valor) {
    if (!valor) return 'Informe seu e-mail.';
    // algo@algo.algo (sem espaços, com domínio de pelo menos 2 letras)
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(valor)) {
      return 'Digite um e-mail válido, por exemplo nome@exemplo.com.';
    }
    return '';
  },
  nascimento(valor) {
    if (!valor) return 'Informe sua data de nascimento.';
    const data = new Date(valor + 'T00:00');
    const hoje = new Date();
    if (data > hoje) return 'A data de nascimento não pode estar no futuro.';
    let idade = hoje.getFullYear() - data.getFullYear();
    const fezAniversario = hoje >= new Date(hoje.getFullYear(), data.getMonth(), data.getDate());
    if (!fezAniversario) idade--;
    if (idade < 16) return 'É preciso ter pelo menos 16 anos para se cadastrar.';
    if (idade > 120) return 'Verifique o ano de nascimento.';
    return '';
  },
  endereco(valor) {
    if (!valor) return 'Informe seu endereço.';
    if (valor.length < 5) return 'Endereço muito curto. Inclua rua e número.';
    return '';
  },
  cidade(valor) {
    if (!valor) return 'Informe sua cidade.';
    if (!/^[A-Za-zÀ-ÿ\s'-]{2,}$/.test(valor)) return 'A cidade deve conter apenas letras.';
    return '';
  },
  estado(valor) {
    if (!valor) return 'Informe a sigla do estado.';
    if (!UFS.includes(valor.toUpperCase())) return 'UF inválida. Use uma sigla existente, por exemplo SP.';
    return '';
  },
  cep(valor) {
    if (!valor) return 'Informe seu CEP.';
    if (!/^\d{8}$/.test(valor)) return 'O CEP deve ter exatamente 8 números.';
    return '';
  },
};

// Mostra ou limpa o erro de UM campo, manipulando o DOM
function exibirResultado(campo, mensagem) {
  const idMensagem = `erro-${campo.id}`;
  let aviso = document.getElementById(idMensagem);

  if (mensagem) {
    // ERRO: troca as classes e injeta (ou atualiza) a mensagem abaixo do campo
    campo.classList.add('campo--erro');
    campo.classList.remove('campo--sucesso');
    campo.setAttribute('aria-invalid', 'true');
    if (!aviso) {
      aviso = document.createElement('small');
      aviso.id = idMensagem;
      aviso.className = 'mensagem-erro';
      campo.after(aviso);                                // insere logo depois do input
      campo.setAttribute('aria-describedby', idMensagem); // leitor de tela lê a mensagem
    }
    aviso.textContent = mensagem;
  } else {
    // SUCESSO: troca as classes e remove a mensagem, se existir
    campo.classList.add('campo--sucesso');
    campo.classList.remove('campo--erro');
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
    aviso?.remove();
  }
}

// Remove espaços nas pontas e troca espaços repetidos por um só
// ("  Maria   Silva " -> "Maria Silva")
function normalizar(valor) {
  return valor.trim().replace(/\s+/g, ' ');
}

// Valida UM campo. Com limpar = true, também grava o valor normalizado
// no campo (usado ao sair do campo e no envio; nunca durante a digitação,
// senão o espaço entre nome e sobrenome sumiria enquanto a pessoa digita)
export function validarCampo(campo, limpar = false) {
  const regra = regras[campo.name];
  if (!regra) return true;
  const valor = normalizar(campo.value);
  if (limpar && campo.type !== 'date') campo.value = valor;
  const mensagem = regra(valor);
  exibirResultado(campo, mensagem);
  return mensagem === '';
}

// Valida o formulário inteiro e devolve a lista de campos com erro
export function validarFormulario(form) {
  const campos = [...form.querySelectorAll('input[name]')];
  return campos.filter((campo) => !validarCampo(campo, true));
}

// Limpa classes e mensagens (usado depois de um envio com sucesso)
export function limparValidacao(form) {
  form.querySelectorAll('.mensagem-erro').forEach((aviso) => aviso.remove());
  form.querySelectorAll('input').forEach((campo) => {
    campo.classList.remove('campo--erro', 'campo--sucesso');
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
  });
}

export function iniciarValidacao() {
  // Desliga os balões nativos do navegador: a partir daqui o JS assume.
  // (Sem JavaScript, required/pattern continuam funcionando como reserva.)
  document.addEventListener('rota:carregada', () => {
    const form = document.querySelector('.formulario');
    if (form) form.noValidate = true;
  });

  // FOCUSOUT: ao sair de um campo preenchido, valida (não acusa erro
  // em campo vazio que a pessoa só atravessou com Tab)
  document.addEventListener('focusout', (evento) => {
    const campo = evento.target;
    if (!campo.closest?.('.formulario') || !campo.name) return;
    if (campo.value.trim() !== '' || campo.classList.contains('campo--erro')) {
      validarCampo(campo, true);
    }
  });

  // INPUT: se o campo já está com erro, revalida a cada tecla,
  // para o erro sumir assim que a pessoa corrigir
  document.addEventListener('input', (evento) => {
    const campo = evento.target;
    if (campo.classList?.contains('campo--erro')) validarCampo(campo);
  });
}
