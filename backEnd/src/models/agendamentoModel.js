import supabase from '../config/SupaBase.js';




export const agendamentoInsert =  async (dataConfig) => {
    if (dataConfig.length === 0) return [];
   

    const { data, error } = await supabase
      .from("agendamentos")
      .insert(dataConfig)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  export const verificaAgendamentoDuplicado = async ( dataConfig) => {
    const { data: agendamentos, error } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("data",  dataConfig.data)
      .eq("time",  dataConfig.time)
      .eq("id_cliente",  dataConfig.id_cliente)
      .eq("id_empresa", dataConfig.id_empresa)
      .eq("slug", dataConfig.slug)
  
    if (error) throw new Error("Erro ao verificar agendamento existente: " + error.message);
  
    return agendamentos.length > 0;
  };