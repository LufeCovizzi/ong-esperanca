/* =========================================================
   storage.js - serviço de acesso ao Web Storage (localStorage)
   Camada de SERVIÇO: é o único arquivo que toca no localStorage.
   Os módulos de interface nunca chamam localStorage diretamente.
   O localStorage só guarda TEXTO (string). Por isso:
   - para gravar: JSON.stringify(objeto) -> string
   - para ler:    JSON.parse(string)     -> objeto/array
   ========================================================= */

const PREFIXO = 'ongEsperanca:';  // evita conflito com chaves de outros sites/projetos

// GRAVAR (set): converte o valor para string JSON e salva
export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
  } catch (erro) {
    // Pode falhar em navegação privada ou com armazenamento cheio
    console.warn('Não foi possível salvar no localStorage:', erro);
  }
}

// LER (get): busca a string e converte de volta com JSON.parse.
// Se a chave não existe ou o conteúdo está corrompido, devolve o valor padrão.
export function carregar(chave, padrao) {
  try {
    const texto = localStorage.getItem(PREFIXO + chave);  // null se não existir
    return texto === null ? padrao : JSON.parse(texto);
  } catch (erro) {
    console.warn('Dado inválido no localStorage, usando o padrão:', erro);
    return padrao;
  }
}

// REMOVER uma chave
export function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch (erro) {
    console.warn('Não foi possível remover do localStorage:', erro);
  }
}
