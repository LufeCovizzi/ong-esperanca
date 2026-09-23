/* =========================================================
   router.js - roteamento da SPA por hash (#/rota)
   Fluxo: usuário clica num link "#/projetos" -> o navegador troca
   só o hash (sem recarregar) -> dispara "hashchange" -> o router
   busca o fragmento HTML da rota e injeta dentro de <main id="app">.
   ========================================================= */

// Tabela de rotas: nome da rota -> arquivo do fragmento + título da aba
const rotas = {
  inicio:      { arquivo: 'views/inicio.html',      titulo: 'Início' },
  projetos:    { arquivo: 'views/projetos.html',    titulo: 'Projetos' },
  cadastro:    { arquivo: 'views/cadastro.html',    titulo: 'Cadastro' },
  componentes: { arquivo: 'views/componentes.html', titulo: 'Guia de componentes' },
};

const ROTA_PADRAO = 'inicio';

// Controle de navegações concorrentes (correção de race condition):
// se o usuário clicar em outra rota antes da anterior terminar de carregar,
// a requisição antiga é cancelada e sua resposta é ignorada.
let navegacaoAtual = 0;
let controlador = null;

// Lê o hash atual e separa rota e seção.
// Ex.: "#/projetos/voluntariado" -> { rota: "projetos", secao: "voluntariado" }
function lerHash() {
  const [, rota, secao] = location.hash.split('/');
  // toLowerCase: "#/Cadastro" digitado à mão também funciona
  return { rota: (rota || ROTA_PADRAO).toLowerCase(), secao };
}

// Marca no menu o link da página atual (aria-current também muda o estilo via CSS)
function atualizarMenu(rota) {
  document.querySelectorAll('[data-rota]').forEach((link) => {
    if (link.dataset.rota === rota) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Função principal: limpa o contêiner e injeta o novo fragmento
async function renderizar() {
  const app = document.querySelector('#app');
  const { rota, secao } = lerHash();

  const minhaNavegacao = ++navegacaoAtual;   // "senha" desta navegação
  controlador?.abort();                       // cancela o fetch anterior, se ainda estiver em andamento
  controlador = new AbortController();
  const pagina = rotas[rota];

  // Rota inexistente: mostra aviso em vez de quebrar a página
  if (!pagina) {
    app.innerHTML = `
      <section class="destaque-total">
        <h1 tabindex="-1">Página não encontrada</h1>
        <p>O endereço acessado não existe. <a href="#/inicio">Voltar ao início</a>.</p>
      </section>`;
    document.title = 'Página não encontrada | ONG Esperança';
    atualizarMenu(null);
    app.querySelector('h1').focus();
    return;
  }

  app.setAttribute('aria-busy', 'true');  // avisa leitores de tela que está carregando

  try {
    const resposta = await fetch(pagina.arquivo, { signal: controlador.signal });  // busca o fragmento
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const html = await resposta.text();                  // converte para texto
    if (minhaNavegacao !== navegacaoAtual) return;       // chegou atrasada: outra navegação já assumiu
    app.innerHTML = html;                                // limpa o antigo e injeta o novo
  } catch (erro) {
    if (erro.name === 'AbortError') return;              // cancelada de propósito: não é erro
    app.innerHTML = `
      <div class="alerta alerta--erro destaque-total" role="alert">
        <strong class="alerta__titulo">Erro:</strong>
        <p>Não foi possível carregar a página. Verifique sua conexão.</p>
        <button type="button" class="botao tentar-novamente">Tentar novamente</button>
      </div>`;
    console.error('Falha ao carregar a rota:', erro);
  } finally {
    app.removeAttribute('aria-busy');
  }

  document.title = `${pagina.titulo} | ONG Esperança`;
  atualizarMenu(rota);

  // Avisa os outros módulos que um novo conteúdo entrou na tela.
  // Vem ANTES da rolagem: os listeners rodam na hora (de forma síncrona),
  // então componentes gerados por template já existem quando rolamos até eles.
  document.dispatchEvent(new CustomEvent('rota:carregada', { detail: { rota } }));

  // Se o link apontou para uma seção (#/projetos/doacoes), rola até ela;
  // senão volta ao topo e leva o foco ao título da nova página
  const alvo = secao && document.getElementById(secao);
  if (alvo) {
    alvo.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo(0, 0);
    app.querySelector('h1')?.focus();
  }
}

export function iniciarRouter() {
  window.addEventListener('hashchange', renderizar);  // intercepta cada navegação

  // Clicar no link da rota ATUAL não muda o hash e, portanto, não dispara
  // hashchange. Sem isto, após uma falha de rede o usuário ficava preso na
  // mensagem de erro. Também trata o botão "Tentar novamente".
  document.addEventListener('click', (evento) => {
    const link = evento.target.closest('a[href^="#/"]');
    const repetiuRota = link && link.getAttribute('href') === location.hash;
    if (repetiuRota || evento.target.closest('.tentar-novamente')) renderizar();
  });
  renderizar();                                        // renderiza a rota inicial
}
