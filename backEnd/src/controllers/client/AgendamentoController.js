import * as loja  from "../../models/Loja.js"
import { DatasConfiguradasModel } from '../../models/DatasConfiguradasModel.js';
import { IntervalosHorarioModel } from '../../models/IntervalosHorarioModel.js';
import * as agendamento from '../../models/agendamentoModel.js';
import { format } from 'date-fns';
export const getHoraririosAgendamentoController = async (req, res) => {
    const { slug } = req.params;

    try {
        const { data: lojaData, error: modelError } = await loja.buscarLojaPorSlugCompleta(slug);

        if (modelError || !lojaData) {
            return res.status(404).json({ message: "Loja não encontrada para este slug." });
        }
        const datasConfig = await DatasConfiguradasModel.buscarDatasPorEmpresaPorId(lojaData.id_empresa);
        const datasConfigIds = datasConfig.map(dc => dc.id).filter(Boolean);

        let intervalos = [];
        if (datasConfigIds.length > 0) {
        intervalos = await IntervalosHorarioModel.getByDataConfigIds(datasConfigIds);
        }

        const result = datasConfig.map(dc => ({
        ...dc,
        intervalos: intervalos
            .filter(iv => iv.data_config_id === dc.id)
            .sort((a, b) => a.inicio.localeCompare(b.inicio))
        }));

    
        
        res.status(200).json(result);
    } catch (err) {
        console.error("Controller Error: Erro ao buscar horários de agendamento:", err);
        res.status(500).json({ message: "Erro interno do servidor ao buscar horários de agendamento." });
    }



} 

export const postAgendamentoController = async (req, res) => {
    try {
        const { slug } = req.params;
        const id_cliente = req.ClientId;
        const { data: dataAgendada, horario } = req.body;

        // Buscar informações da loja
        const lojaInfo = await loja.buscarLojaPorSlugCompleta(slug);
        if (!lojaInfo) {
            return res.status(404).json({ message: "Loja não encontrada." });
        }

        const id_empresa = lojaInfo.data.id_empresa;
        const dataFormatada = format(dataAgendada, 'yyyy-MM-dd');

        const agendamentoData = {
            data: dataFormatada,
            time: horario,
            slug,
            id_cliente,
            id_empresa,
        };

        // Verificar se já existe agendamento no mesmo dia e horário
        const agendamentoDuplicado = await agendamento.verificaAgendamentoDuplicado(agendamentoData);
        if (agendamentoDuplicado) {
            return res.status(400).json({ message: "Já existe um agendamento para esta data e horário." });
        }

        // Verificar se a data está configurada
        const dataConfigurada = await DatasConfiguradasModel.getByDataAndEmpresa(dataAgendada, id_empresa);
        if (!dataConfigurada) {
            return res.status(400).json({ message: "A data escolhida não está disponível para agendamentos." });
        }

        // Atualizar status do intervalo de horário
        const intervaloAtualizado = await IntervalosHorarioModel.updateAvailableStatus(
            dataConfigurada.id,
            false,
            horario
        );

        if (!intervaloAtualizado) {
            return res.status(400).json({ message: "Horário selecionado não está mais disponível." });
        }

        // Criar agendamento
        const novoAgendamento = await agendamento.agendamentoInsert(agendamentoData);

        return res.status(201).json({
            message: "Agendamento criado com sucesso.",
            data: novoAgendamento,
        });

    } catch (err) {
        console.error("Erro no controller de agendamento:", err);
        return res.status(500).json({ message: "Erro interno no servidor ao criar agendamento." });
    }
};
