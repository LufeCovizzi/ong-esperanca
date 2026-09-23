# ONG Esperança

Versão atual: 1.0.0

Site institucional (HTML5, CSS3 e JavaScript) organizado por separação de responsabilidades.

## Estrutura

Single Page Application (SPA) com roteamento por hash.

```
ong-esperanca/
├── html/
│   ├── index.html          -> casca da SPA (cabeçalho, menu, <main id="app">, toast, rodapé)
│   └── views/              -> fragmentos injetados no #app pelo router
│       ├── inicio.html       (#/inicio)
│       ├── projetos.html     (#/projetos)
│       ├── cadastro.html     (#/cadastro)
│       └── componentes.html  (#/componentes)
├── css/
│   ├── reset.css
│   └── style.css
├── imagens/                -> cada imagem em WebP + JPG/PNG
└── js/
    ├── main.js             -> ponto de entrada: importa e inicia os módulos
    ├── services/
    │   └── storage.js      -> único ponto de acesso ao localStorage (JSON)
    ├── data/
    │   ├── projetos.js     -> dados de origem dos cards (array de objetos)
    │   └── impacto.js      -> dados do gráfico da página inicial
    └── modules/
        ├── router.js       -> intercepta o hashchange e injeta a view no #app
        ├── cards.js        -> gera os cards clonando o <template> com os dados
        ├── filtros.js      -> filtra os cards (click com delegação de eventos)
        ├── menu.js         -> acessibilidade e fechamento do menu mobile
        ├── formulario.js   -> máscaras (input) e envio (submit) do cadastro
        ├── validacao.js    -> regras de consistência (RegEx) e mensagens de erro
        ├── persistencia.js -> rascunho e histórico do cadastro
        ├── grafico.js      -> gráfico com Chart.js 4.5.1 (CDN, import dinâmico)
        └── toast.js        -> exibe notificações
```

## Como abrir

O router usa `fetch()` e módulos ES6, que só funcionam com o site servido por um servidor
(não abrindo o arquivo com dois cliques). No VS Code, use a extensão **Live Server**
("Go Live") e acesse `html/index.html`.

## Bibliotecas externas

- **Chart.js 4.5.1** via CDN jsDelivr (`+esm`), carregada sob demanda com `import()`.
  Se a CDN falhar, os dados aparecem numa tabela.

## Validação

Todas as páginas e o CSS passam no W3C Nu HTML Checker sem erros nem avisos.
