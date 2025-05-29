import bcrypt from 'bcrypt';
import {
  buscarTokenRecuperacao,
  deletarTokenRecuperacao,
  buscarEmpresaPorId,
  atualizarSenhaEmpresa
} from '../models/EmpresaModel.js';

export const definirNovaSenha = async (req, res) => {
  const { token, senha } = req.body;

  if (!token || !senha) {
    return res.status(400).json({ mensagem: 'Token e nova senha são obrigatórios.' });
  }

  try {
    const tokenData = await buscarTokenRecuperacao(token);
    console.log('TokenData:', tokenData);

    if (!tokenData) {
      return res.status(400).json({ mensagem: 'Token inválido ou expirado.' });
    }

    if (new Date() > new Date(tokenData.token_expira_em)) {
      return res.status(400).json({ mensagem: 'Token expirado.' });
    }

    const empresaResult = await buscarEmpresaPorId(tokenData.id); 
    if (!empresaResult.data) {
      return res.status(404).json({ mensagem: 'Empresa não encontrada.' });
    }

    const empresa = empresaResult.data;

    const senhaHash = await bcrypt.hash(senha, 10);
    await atualizarSenhaEmpresa(empresa.id, senhaHash);

    await deletarTokenRecuperacao(token);

    return res.status(200).json({ mensagem: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};
