import supabase from '../config/SupaBase.js';



export async function buscarClientePorId(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) throw error;
    return data;
  };

  