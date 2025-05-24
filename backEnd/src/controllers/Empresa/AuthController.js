import * as empresas from "../../models/EmpresaModel.js";
import jwt from "jsonwebtoken";
import { inserirEmpresa } from '../../models/EmpresaModel.js';
import bcrypt from 'bcrypt';
import validarDadosEmpresa from '../../validators/EmpresaValidator.js'

export const loginEmpresa = async (req, res) => {
  const { email, senha } = req.body;
  console.log('req.body:', req.body);

    
    if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }
  try {

    const { error, data } = await empresas.LoginEmpresa(email, senha);

    if (error || !data) {
      return res.status(401).json({ error: error || 'Email ou senha inválidos' });
    }

    
    const token = jwt.sign({
       id: data.id  ,tipo: 'empresa'}, 
       process.env.JWT_SECRET,{
      expiresIn: '1d'
    });

    
    res.cookie("token_empresa", token, {
      httpOnly: false,
      secure: true, 
      sameSite: "none", 
      maxAge:  24 * 60 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("Token gerado:", token);
    res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login: " + error.message });
  }
};
export const criarEmpresa = async (req, res) => {
    try {
      const dados = req.body;
  
  
      const errors = await validarDadosEmpresa(dados);
      if (Object.keys(errors).length > 0) {
          
          console.log(errors);
          return res.status(400).json({ errors }); 
      }
  
  
      const { nome, cnpj, responsavel, categoria, telefone, endereco, cidade, uf, site, email, senha ,confirmarSenha } = dados;
   
  
    
      const senhaHash = await bcrypt.hash(senha, 10);
  
      
      const { error } = await inserirEmpresa({
        nome,
        cnpj,
        responsavel,
        categoria,
        telefone,
        endereco,
        cidade,
        uf,
        site,
        email,
        senha: senhaHash
      });
  
      if (error) {
        return res.status(500).json({ mensagem: error });
      }
  
      return res.status(201).json({ mensagem: 'Empresa cadastrada com sucesso!' });
    } catch (error) {
      return res.status(500).json({ mensagem: error });
    }
  };


  export const logout = (req, res) => {
  
      res.clearCookie('token_empresa', {
        httpOnly: false,
        secure: true, 
        sameSite: 'none',
        path: '/',
      });
  
      res.status(200).send('Logout realizado com sucesso');
    
  };
  