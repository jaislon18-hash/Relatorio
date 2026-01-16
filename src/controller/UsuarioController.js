import { UsuarioDAO } from '../database/DAO/UsuarioDAO.js';
import { UsuarioModel } from '../model/UsuarioModel.js';
import { EmpresaDAO } from '../database/DAO/EmpresaDAO.js';

export class UsuarioController
{
    /**
     * Renderiza o formulário de Login.
     * 
     * GET: /login
     */
    async formLogin(req, res) {
        res.render('login', { 
            erro: null,
            email: '' 
        });
    }

    /**
     * Processa a autenticação.
     * 
     * POST: /login
     */
    async login (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.render('login', { 
                    erro: "Email e senha são obrigatórios.", 
                    email: email 
                });
            }

            const usuario = await dao.buscarPorEmail(email);

            if (!usuario || usuario.getSenha() !== senha)
            {
                return res.render('login', { 
                    erro: "Email ou senha inválidos.", 
                    email: email 
                });
            }

            res.redirect('/atividades');
        }
        catch (erro)
        {
            console.log(erro);
            res.render('login', { 
                erro: "Erro interno: " + erro.message, 
                email: req.body.email 
            });
        }
    }

    /**
     * Lista todos os usuários (View).
     * 
     * GET: /usuarios
     */
    async listar (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            res.render('usuario/listar', { 
                lista: lista,
                erro: null 
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.render('usuario/listar', { 
                lista: [], 
                erro: "Erro ao listar usuários: " + erro.message 
            });
        }
    }

    /**
     * Renderiza form de criação.
     * 
     * GET: /usuarios/novo
     */
    async formCriar (req, res)
    {
        try 
        {
            const empresaDAO = new EmpresaDAO();
            const empresas = await empresaDAO.buscarTodos();

            res.render('usuario/form', {
                acao: 'Criar',
                rota: '/usuarios',
                usuario: null,
                empresas: empresas,
                erro: null
            });
        }
        catch (erro)
        {
            res.redirect('/usuarios');
        }
    }

    /**
     * Renderiza form de edição.
     * 
     * GET: /usuarios/editar/:cpf
     */
    async formEditar (req, res)
    {
        try
        {
            const cpf = req.params.cpf;
            const dao = new UsuarioDAO();
            const empresaDAO = new EmpresaDAO();

            const usuario = await dao.buscarPorCpf(cpf);
            const empresas = await empresaDAO.buscarTodos();

            if (!usuario) return res.redirect('/usuarios');

            res.render('usuario/form', {
                acao: 'Editar',
                rota: `/usuarios/${cpf}?method=PUT`,
                usuario: usuario,
                empresas: empresas,
                erro: null
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/usuarios');
        }
    }

    /**
     * Cria usuário (com senha automática).
     * 
     * POST: /usuarios
     */
    async criar (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const { cpf, nome, email, telefone, admin, empresa } = req.body;

            // Senha temporária = 5 primeiros dígitos do CPF 
            const novoUsuario = new UsuarioModel(
                cpf, nome, email, "temp", telefone, admin ? 1 : 0, empresa
            );

            await dao.criar(novoUsuario);

            res.redirect('/usuarios');
        }
        catch (erro)
        {
            console.log(erro);
            
            const empresaDAO = new EmpresaDAO();
            const empresas = await empresaDAO.buscarTodos();

            let msg = "Erro ao cadastrar: " + erro.message;
            if (erro.code == 'ER_DUP_ENTRY') msg = "Já existe usuário com este CPF ou Email.";

            res.render('usuario/form', {
                acao: 'Criar',
                rota: '/usuarios',
                usuario: req.body,
                empresas: empresas,
                erro: msg
            });
        }
    }

    /**
     * Atualiza usuário.
     * 
     * PUT: /usuarios/:cpf
     */
    async atualizar (req, res)
    {
        const dao = new UsuarioDAO();
        const cpfUrl = req.params.cpf;

        try
        {
            const { nome, email, senha, telefone, admin, empresa } = req.body;

            const usuarioAtualizado = new UsuarioModel(
                cpfUrl, nome, email, senha, telefone, admin ? 1 : 0, empresa
            );

            await dao.atualizar(usuarioAtualizado);

            res.redirect('/usuarios');
        }
        catch (erro)
        {
            console.log(erro);
            res.send("Erro ao atualizar: " + erro.message);
        }
    }

    /**
     * Remove usuário.
     * 
     * DELETE: /usuarios/:cpf
     */
    async apagar (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const cpf = req.params.cpf;
            await dao.apagar(cpf);
            res.redirect('/usuarios');
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/usuarios');
        }
    }
}