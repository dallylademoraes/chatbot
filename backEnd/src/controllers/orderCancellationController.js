import OrderCancellationModel from '../models/OrderCancellationModel.js';
import { atualizarStatusPedido, buscarPedidoPorId } from '../models/pedidoModel.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const orderCancellationController = {
  // Criar pedido de cancelamento
  async criar(req, res) {
    try {
      const { order_id } = req.body;

      // Buscar pedido atual para verificar status
      const pedido = await buscarPedidoPorId(order_id);

      if (!pedido) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      // Só permite cancelamento se o status for 0, 1 ou 2
      const statusNum = Number(pedido.status);
      const statusPermitidos = [0, 1, 2];
      if (!statusPermitidos.includes(statusNum)) {
        return res.status(400).json({ error: "Pedido não pode ser cancelado nesse status." });
      }

      // Criar solicitação de cancelamento
      const data = await OrderCancellationModel.criar(req.body);

      // Atualizar status do pedido para cancelado (5)
      await atualizarStatusPedido(order_id, 5);

      res.status(201).json(data);
    } catch (err) {
      console.error("Erro ao criar cancelamento:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Listar todas as solicitações de cancelamento
  async listar(req, res) {
    try {
      const data = await OrderCancellationModel.listar();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Atualizar status da solicitação de cancelamento (aprovado ou rejeitado)
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pendente', 'aprovado', 'rejeitado'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const data = await OrderCancellationModel.atualizarStatus(id, status);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default orderCancellationController;
