/* =========================================================
   main.js - ponto de entrada do JavaScript
   Importa os módulos e inicia cada funcionalidade.
   ========================================================= */

import { iniciarRouter } from './modules/router.js';
import { iniciarMenu } from './modules/menu.js';
import { iniciarFormulario } from './modules/formulario.js';
import { iniciarValidacao } from './modules/validacao.js';
import { iniciarPersistencia } from './modules/persistencia.js';
import { iniciarToast } from './modules/toast.js';
import { iniciarCards } from './modules/cards.js';
import { iniciarFiltros } from './modules/filtros.js';
import { iniciarGrafico } from './modules/grafico.js';

iniciarMenu();
iniciarFormulario();
iniciarValidacao();
iniciarPersistencia();
iniciarToast();
iniciarCards();   // precisa ouvir o evento antes do router renderizar
iniciarFiltros();
iniciarGrafico();
iniciarRouter();
