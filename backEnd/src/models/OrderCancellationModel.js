import { createClient } from '@supabase/supabase-js';
import supabaseConfig from '../config/SupaBase.js'; // se esse arquivo exporta config
import dotenv from 'dotenv';

dotenv.config(); // carrega variáveis de ambiente

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const OrderCancellationModel = {
  async criar({ order_id, cliente_id, motivo }) {
    console.log("Inserindo cancelamento:", { order_id, cliente_id, motivo });
    const { data, error } = await supabase
      .from('order_cancellations')
      .insert([{ order_id, cliente_id, motivo, status: 'pendente' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async listar() {
    const { data, error } = await supabase
      .from('order_cancellations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async atualizarStatus(id, status) {
    const { data, error } = await supabase
      .from('order_cancellations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export default OrderCancellationModel;
