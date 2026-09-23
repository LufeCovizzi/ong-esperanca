/* =========================================================
   vite.config.js - build de produção com o Vite
   npm run build  -> gera a pasta dist/ minificada
   npm run dev    -> servidor de desenvolvimento
   ========================================================= */

import { defineConfig } from 'vite';
import { minify } from 'html-minifier-terser';
import { readdir, readFile } from 'node:fs/promises';

// Opções de minificação de HTML (o Vite só minifica JS e CSS)
const opcoesHtml = {
  collapseWhitespace: true,        // remove espaços e quebras de linha entre tags
  conservativeCollapse: true,      // mantém 1 espaço onde ele separa palavras
  removeComments: true,            // remove <!-- comentários -->
  minifyJS: true,                  // minifica o script inline do tema
  minifyCSS: true,
};

// Plugin 1: minifica o index.html depois que o Vite injeta os arquivos gerados
function minificarIndex() {
  return {
    name: 'minificar-index',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => minify(html, opcoesHtml),
    },
  };
}

// Plugin 2: as views são carregadas pelo router com fetch() em tempo de
// execução, então o Vite não as enxerga no grafo de módulos (nem as imagens
// citadas dentro delas). Este plugin minifica cada view e a coloca em
// dist/html/views/, e copia a pasta imagens/ mantendo os mesmos caminhos.
function copiarViews() {
  return {
    name: 'copiar-views',
    async generateBundle() {
      for (const imagem of await readdir('imagens')) {
        this.emitFile({
          type: 'asset',
          fileName: `imagens/${imagem}`,
          source: await readFile(`imagens/${imagem}`),
        });
      }

      const pasta = 'html/views';
      for (const arquivo of await readdir(pasta)) {
        if (!arquivo.endsWith('.html')) continue;
        const html = await readFile(`${pasta}/${arquivo}`, 'utf8');
        this.emitFile({
          type: 'asset',
          fileName: `${pasta}/${arquivo}`,
          source: await minify(html, opcoesHtml),
        });
      }
    },
  };
}

export default defineConfig({
  base: './',                              // caminhos relativos: funciona em subpastas (ex.: GitHub Pages)
  plugins: [minificarIndex(), copiarViews()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',                      // navegadores com suporte a módulos ES e import() dinâmico
    assetsInlineLimit: 0,                  // imagens continuam como arquivos (não viram base64)
    rollupOptions: {
      input: 'html/index.html',            // ponto de entrada da SPA
    },
  },
});
