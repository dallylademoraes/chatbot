// src/routes/clienteRoutes.js
import express from 'express';
import clienteController from '../controllers/client/clienteController.js';

import * as AuthClinteController from "../controllers/client/AuthClinteController.js";

import * as AgendamentoController from"../controllers/client/AgendamentoController.js"
import { clientePrivate } from '../middleware/protectRouterClient.js'; 

const router = express.Router();

// Middleware específico para estas rotas
router.use((req, res, next) => {
  console.log(`Recebida requisição para: ${req.method} ${req.path}`);
  next();
});


// Rota para listar clientes (opcional)
router.get('/clientes', clienteController.listar);  // Ajuste aqui para '/clientes'

// Rota para obter cliente por ID (opcional)
router.get('/clientes/:id', clienteController.obterPorId);  // Ajuste aqui para '/clientes/:id'

// Rota para atualizar cliente (opcional)
router.put('/clientes/:id', clienteController.atualizar);  // Ajuste aqui para '/clientes/:id'

// Rota para deletar cliente (opcional)
router.delete('/clientes/:id', clienteController.remover);  // Ajuste aqui para '/clientes/:id'



router.use((req, res, next) => {
  console.log(`Recebida requisição para: ${req.method} ${req.path}`);
  next();
});


router.post('/login', AuthClinteController.login); 
router.post('/clientes', AuthClinteController.cadastrar); 
router.get('/clientLogout', AuthClinteController.logout);

router.get('/:slug/Horarios',clientePrivate, AgendamentoController.getHoraririosAgendamentoController);
router.post('/:slug/agendamento', clientePrivate , AgendamentoController.postAgendamentoController);

export default router;
