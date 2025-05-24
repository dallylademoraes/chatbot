import express from 'express';
import DonoController from '../controllers/Empresa/DonoController.js';

const router = express.Router();

router.get('/dono', DonoController.getDonoData);

export default router;
