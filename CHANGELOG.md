# Changelog

Todas as mudanças relevantes do projeto são registradas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-09-23

### Adicionado
- Seletor de tema com modos automático, claro, escuro e alto contraste, salvo no localStorage (#9).
- Build de produção com Vite: JavaScript, CSS e HTML minificados, 43% menor (#12).
- Imagens responsivas com `srcset` e `sizes` em várias larguras (#13).
- CI/CD com GitHub Actions: build em todo pull request e deploy no GitHub Pages a cada release (#14).
- README reescrito com instalação, testes, build, deploy e versionamento (#7).

### Corrigido
- Checkbox do menu hambúrguer ficava focável e sem rótulo no desktop (#10, #11).
- `logo.webp` era maior que o PNG; agora é WebP sem perdas, 658 B (#13).

## [1.0.2] - 2026-09-23

### Corrigido
- Link "Pular para o conteúdo" abria a página inicial em vez de levar o foco ao conteúdo (#1).

### Adicionado
- CHANGELOG com o histórico de versões (#2).

## [1.0.1] - 2026-09-23

### Corrigido
- Rotas digitadas com letras maiúsculas (ex.: `#/Cadastro`) abriam "Página não encontrada".

## [1.0.0] - 2026-09-23

### Adicionado
- Páginas em HTML5 semântico e imagens otimizadas em WebP e JPG/PNG.
- Layout com CSS Grid de 12 colunas, Flexbox e 5 breakpoints.
- Menu responsivo com dropdown e menu hambúrguer.
- Componentes de feedback: badges, alertas, toast e modal.
- SPA com roteamento por hash.
- Cards de projetos gerados por `<template>` e filtros por situação.
- Validação do cadastro com RegEx e mensagens de erro no DOM.
- Rascunho, histórico e preferências salvos no localStorage.
- Gráfico de impacto com Chart.js.
