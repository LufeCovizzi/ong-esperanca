# ONG Esperança

![Versão](https://img.shields.io/github/v/release/LufeCovizzi/ong-esperanca?label=vers%C3%A3o)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.1-FF6384?logo=chartdotjs&logoColor=white)

Site institucional de uma ONG fictícia, construído como **Single Page Application (SPA)** em HTML5, CSS3 e JavaScript puro, sem frameworks. Projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas.

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução local](#instalação-e-execução-local)
- [Build](#build)
- [Validação e testes](#validação-e-testes)
- [Versionamento](#versionamento)
- [Acessibilidade](#acessibilidade)
- [Autor](#autor)

## Sobre o projeto

A ONG Esperança precisava de um site para divulgar seus projetos sociais, captar voluntários e doadores e receber cadastros. A aplicação tem quatro páginas (Início, Projetos, Cadastro e Guia de componentes) carregadas dinamicamente, sem recarregar o documento, e foi desenvolvida com foco em semântica, responsividade, acessibilidade e código modular.

## Funcionalidades

- **Navegação SPA** com roteamento por hash (`#/projetos`), incluindo botões Voltar/Avançar do navegador e página de rota não encontrada.
- **Layout responsivo** com CSS Grid de 12 colunas, Flexbox e 5 breakpoints (480, 768, 1024, 1280 e 1440 px).
- **Menu** com dropdown no desktop e menu hambúrguer no celular.
- **Cards de projetos** gerados a partir de dados com o elemento `<template>`, com filtros por situação.
- **Formulário de cadastro** com validação em tempo real (RegEx), máscaras de CEP e UF e mensagens de erro acessíveis.
- **Persistência no navegador** com `localStorage`: rascunho do formulário, histórico de cadastros e último filtro escolhido.
- **Gráfico de impacto** com Chart.js, com tabela de dados como alternativa se a biblioteca não carregar.
- **Componentes de feedback**: badges, alertas, toast (notificação) e modal nativo.

## Tecnologias

| Camada | Tecnologia | Uso no projeto |
|---|---|---|
| Estrutura | HTML5 semântico | `header`, `nav`, `main`, `section`, `figure`, `address`, `template`, Popover API |
| Estilo | CSS3 | Grid, Flexbox, variáveis CSS, media queries, pseudo-classes, animações |
| Comportamento | JavaScript (ES6+) | Módulos ES (`import`/`export`), `fetch`, `async/await`, eventos, `CustomEvent`, `localStorage` |
| Biblioteca | Chart.js 4.5.1 | Gráfico de barras, importado via CDN jsDelivr com `import()` dinâmico |
| Imagens | WebP + JPG/PNG | Formatos otimizados com alternativa via `<picture>` |
| Qualidade | W3C Nu HTML Checker | Validação de HTML e CSS |
| Versionamento | Git + GitHub | GitFlow, Conventional Commits, issues, milestones e pull requests |

## Estrutura de pastas

```
ong-esperanca/
├── html/
│   ├── index.html            casca da SPA (cabeçalho, menu, <main id="app">, toast e rodapé)
│   └── views/                fragmentos injetados no #app pelo router
│       ├── inicio.html         #/inicio
│       ├── projetos.html       #/projetos
│       ├── cadastro.html       #/cadastro
│       └── componentes.html    #/componentes
├── css/
│   ├── reset.css             zera os estilos padrão do navegador
│   └── style.css             variáveis, grid, componentes e breakpoints
├── imagens/                  cada imagem em WebP e JPG/PNG
├── js/
│   ├── main.js               ponto de entrada: importa e inicia os módulos
│   ├── data/                 dados de origem (projetos e impacto)
│   ├── services/
│   │   └── storage.js        único ponto de acesso ao localStorage
│   └── modules/              um arquivo por funcionalidade
│       ├── router.js           roteamento da SPA
│       ├── menu.js             menu responsivo
│       ├── cards.js            geração dos cards por <template>
│       ├── filtros.js          filtros dos projetos
│       ├── formulario.js       máscaras e envio do cadastro
│       ├── validacao.js        regras de validação e mensagens de erro
│       ├── persistencia.js     rascunho e histórico do cadastro
│       ├── grafico.js          integração com o Chart.js
│       └── toast.js            notificações
├── package.json              scripts do npm e dependências de desenvolvimento
├── vite.config.js            configuração do build de produção
├── CHANGELOG.md              histórico de versões
└── README.md
```

## Pré-requisitos

- **Git** para clonar o repositório ([download](https://git-scm.com/downloads)).
- Um **navegador atualizado** (Chrome, Edge, Firefox ou Safari).
- Um **servidor local** para servir os arquivos. Qualquer uma destas opções funciona:
  - **VS Code** com a extensão **Live Server** (recomendado);
  - **Python 3**, que já traz o módulo `http.server`;
  - **Node.js**, usando `npx serve`.
- **Conexão com a internet** para carregar o Chart.js pela CDN (sem ela, o site funciona e mostra os dados do gráfico em tabela).

> **Por que um servidor?** O site usa módulos ES e `fetch()`, que o navegador bloqueia em arquivos abertos direto do disco (`file://`). Abrir o `index.html` com dois cliques deixa a página sem conteúdo.

## Instalação e execução local

Para **rodar** o site não é preciso instalar nada. O `npm install` só é necessário para gerar o build de produção (veja [Build](#build)).

1. Clone o repositório e entre na pasta:
   ```bash
   git clone https://github.com/LufeCovizzi/ong-esperanca.git
   cd ong-esperanca
   ```
2. Inicie um servidor local na raiz do projeto, com uma das opções:

   **Opção A: VS Code + Live Server**
   Abra a pasta no VS Code, clique com o botão direito em `html/index.html` e escolha **Open with Live Server**.

   **Opção B: Python 3**
   ```bash
   python -m http.server 8000
   ```

   **Opção C: Node.js**
   ```bash
   npx serve .
   ```
3. Acesse no navegador (nas opções B e C):
   ```
   http://localhost:8000/html/index.html
   ```
   Na opção C, troque a porta pela que o terminal indicar.

## Build

O site roda direto no navegador durante o desenvolvimento, mas a versão de produção é gerada com o **[Vite](https://vite.dev/) 8**, que empacota os módulos e minifica o código. A configuração está em `vite.config.js`.

Requer **Node.js 20.19 ou superior**.

```bash
npm install        # instala o Vite e o html-minifier-terser (dependências de desenvolvimento)
npm run build      # gera a pasta dist/ pronta para produção
npm run preview    # serve a pasta dist/ para conferir o resultado
```

Depois do `npm run preview`, acesse o endereço indicado no terminal acrescentando `/html/index.html`.

O que o build faz:

- Junta os 14 arquivos JavaScript em **1** e os 2 arquivos CSS em **1**, minificados e com hash no nome (cache seguro).
- Minifica o `index.html` e as views com o `html-minifier-terser` (o Vite não minifica HTML).
- Copia as views e as imagens, que o router carrega com `fetch()` em tempo de execução e que por isso ficam fora do grafo de módulos do Vite.
- Mantém o Chart.js externo, carregado pela CDN com `import()` dinâmico.

| Tipo | Código-fonte | Build | Redução |
|---|---|---|---|
| JavaScript | 14 arquivos, 36,7 KB | 1 arquivo, 16,0 KB | 56,4% |
| CSS | 2 arquivos, 28,1 KB | 1 arquivo, 17,3 KB | 38,5% |
| HTML | 5 arquivos, 13,6 KB | 5 arquivos, 11,3 KB | 17,2% |
| **Total** | **78,4 KB** | **44,6 KB** | **43,2%** |

Com a compressão gzip aplicada pelos servidores, o total transferido cai para 15,3 KB (80,5% menor que o código-fonte). A pasta `dist/` é gerada e não é versionada.

## Validação e testes

O projeto ainda não tem uma suíte de testes automatizados. A qualidade é verificada de duas formas:

**1. Validação W3C (HTML e CSS)**

Envie `html/index.html`, os arquivos de `html/views/` e os de `css/` ao [W3C Nu HTML Checker](https://validator.w3.org/nu/) (opção *File upload*). O resultado esperado é nenhum erro e nenhum aviso.

**2. Roteiro de testes manuais**

Com o site rodando localmente e o DevTools aberto (F12):

| Cenário | Como testar | Resultado esperado |
|---|---|---|
| Navegação | Clicar nos itens do menu e usar Voltar/Avançar | Conteúdo troca sem recarregar a página |
| Rota inválida | Acessar `#/nao-existe` | Mensagem "Página não encontrada" |
| Rede lenta | Network > Slow 3G; clicar em Projetos e logo em Cadastro | A tela mostra Cadastro |
| Sem conexão | Network > Offline; trocar de página | Alerta com botão "Tentar novamente" |
| Validação | Enviar o cadastro vazio e com dados inválidos | Campos em vermelho com mensagem de ajuda |
| Duplo clique | Dar duplo clique em "Enviar cadastro" com dados válidos | Um único envio registrado |
| localStorage | Preencher parte do cadastro e recarregar | "Rascunho restaurado" e campos preenchidos |
| Responsividade | Modo responsivo (Ctrl+Shift+M) de 375 a 1440 px | Sem rolagem horizontal |

## Versionamento

- **GitFlow:** a `main` guarda apenas versões estáveis; a `develop` é a branch padrão de integração. Cada funcionalidade nasce em `feature/*` (ou `bugfix/*`) a partir da `develop`; versões são preparadas em `release/*`; correções urgentes em produção usam `hotfix/*` a partir da `main`.
- **Pull requests:** toda mudança entra por PR, com descrição do que foi feito e de como testar. A palavra-chave `Closes #N` fecha a issue relacionada no merge.
- **Issues e milestones:** cada tarefa ou bug vira uma issue com label; as issues de uma versão são agrupadas em um milestone.
- **Conventional Commits:** mensagens no formato `tipo: descrição`, com os tipos `feat` (funcionalidade), `fix` (correção), `docs` (documentação) e `chore` (manutenção).
- **Versionamento Semântico (MAJOR.MINOR.PATCH):** correções sobem o PATCH, funcionalidades compatíveis sobem o MINOR e mudanças incompatíveis sobem o MAJOR. Cada versão recebe uma tag (`v1.0.2`) e uma [release](https://github.com/LufeCovizzi/ong-esperanca/releases) no GitHub.
- **Changelog:** as mudanças de cada versão ficam no [CHANGELOG.md](CHANGELOG.md).

Fluxo para contribuir:

```bash
git switch develop
git pull
git switch -c feature/nome-da-funcionalidade
# ... alterações ...
git add .
git commit -m "feat: descrição curta da funcionalidade"
git push -u origin feature/nome-da-funcionalidade
# depois, abra um pull request para a develop no GitHub
```

## Acessibilidade

- Estrutura semântica, um `h1` por página e link "Pular para o conteúdo".
- Foco visível (`:focus-visible`) e navegação completa por teclado, incluindo o dropdown (`:focus-within`) e o fechamento do menu com Esc.
- Erros de formulário indicados por cor, ícone e texto, com `aria-invalid` e `aria-describedby`.
- Gráfico com `aria-label` e tabela de dados alternativa.
- Animações desativadas para quem ativa a preferência de reduzir movimento (`prefers-reduced-motion`).

## Autor

**Luiz Fernando Covizzi Castilho**
[GitHub](https://github.com/LufeCovizzi) · [LinkedIn](https://www.linkedin.com/in/luiz-fernando-covizzi)
