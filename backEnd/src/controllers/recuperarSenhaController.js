import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { buscarEmpresaPorEmail, atualizarTokenEmpresa } from '../models/EmpresaModel.js';

export const enviarEmailRecuperacao = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ mensagem: 'Email é obrigatório.' });
    }

    try {
        const resultado = await buscarEmpresaPorEmail(email);

        if (!resultado) {
            return res.status(500).json({ mensagem: 'Erro inesperado ao buscar empresa.' });
        }

        const { data: empresa, error } = resultado;

        if (error || !empresa) {
            return res.status(404).json({ mensagem: 'Empresa não encontrada com esse e-mail.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiracao = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

        try {
            await atualizarTokenEmpresa(email, token, expiracao);
        } catch (erroUpdate) {
            return res.status(500).json({ mensagem: 'Erro ao salvar token de recuperação.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const linkRecuperacao = `${process.env.URL_FRONTEND}/nova-senha?token=${token}`;

        const mailOptions = {
            from: `"Sistema" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Recuperação de senha',
            html: `<p>Olá,</p>
                   <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
                   <a href="${linkRecuperacao}">Recuperar senha</a>
                   <p>Esse link expira em 1 hora.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ mensagem: 'E-mail de recuperação enviado com sucesso.' });
    } catch (err) {
        console.error('Erro ao enviar email:', err);
        res.status(500).json({ mensagem: 'Erro interno ao enviar email.' });
    }
};
