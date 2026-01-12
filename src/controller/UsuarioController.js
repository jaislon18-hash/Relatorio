import { UsuarioDAO } from '../database/DAO/UsuarioDAO.js';
import { UsuarioModel } from '../model/UsuarioModel.js';

export class UsuarioController
{
    /**
     * Realiza a autenticação do usuário (Login).
     * 
     * Método POST: /login
     * Body: { "email": "...", "senha": "..." }
     */
    async login (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const { email, senha } = req.body;

            // 1. Validação básica de entrada
            if (!email || !senha)
            {
                return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
            }

            // 2. Busca o usuário pelo Email
            const usuario = await dao.buscarPorEmail(email);

            // 3. Verificação de Segurança
            // Se o usuário não existe OU a senha não bate, retornamos erro 401 (Unauthorized).
            // Atenção: Usamos uma mensagem genérica para evitar enumeração de usuários (pesquise mais a fundo sobre isso).
            if (!usuario || usuario.getSenha() !== senha)
            {
                return res.status(401).json({ mensagem: "Email ou senha inválidos." });
            }

            // 4. Sanitização (Remover dados sensíveis antes de enviar pro Front)
            // Criamos um objeto simples apenas com o que o Front precisa saber.
            const usuarioLogado = {
                cpf: usuario.getCpf(),
                nome: usuario.getNome(),
                email: usuario.getEmail(),
                admin: usuario.getAdmin(),
                empresaId: usuario.getEmpresa()
            };

            res.status(200).json({ 
                mensagem: "Login realizado com sucesso!", 
                usuario: usuarioLogado 
            });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro interno no servidor ao realizar login.", detalhe: erro.message });

        }
    }

    /**
     * Lista todos os usuários.
     * 
     * Método GET: /usuarios
     */
    async listar (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const lista = await dao.buscarTodos();

            // "segura" porque não exibe senha do usuário
            const listaSegura = lista.map(usuario => 
            {
                return {
                    cpf: usuario.getCpf(),
                    nome: usuario.getNome(),
                    email: usuario.getEmail(),
                    telefone: usuario.getTelefone(),
                    admin: usuario.getAdmin(),
                    empresa: usuario.getEmpresa()
                };
            });

            res.status(200).json(listaSegura);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao listar usuários.", detalhe: erro.message });
        }
    }

    /**
     * Busca um usuário pelo CPF.
     * 
     * Método GET: /usuarios/:cpf
     */
    async buscarPorCpf (req, res)
    {
        const dao = new UsuarioDAO();
        
        try
        {
            const cpf = req.params.cpf;
            const usuario = await dao.buscarPorCpf(cpf);

            if (!usuario)
            {
                return res.status(404).json({ mensagem: "Usuário não encontrado." });
            }

            res.status(200).json(usuario);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar usuário.", detalhe: erro.message });
        }
    }

    /**
     * Cadastra um novo usuário.
     * Método POST: /usuarios
     */
    async criar (req, res)
    {
        const dao = new UsuarioDAO();

        try
        { 
            const { cpf, nome, email, telefone, admin, empresa } = req.body;

            // Regra de Negócio: A senha inicial é gerada automaticamente baseada no CPF.
            const senhaTemporaria = cpf.replace(/\D/g, '').substring(0, 5);

            const novoUsuario = new UsuarioModel(cpf, nome, email, senhaTemporaria, telefone, admin, empresa);

            await dao.criar(novoUsuario);

            // Retornamos sucesso, mas sem expor a senha gerada explicitamente no JSON de resposta,
            // apenas informamos que foi criado.
            res.status(201).json({ 
                mensagem: "Usuário criado com sucesso! A senha padrão são os 5 primeiros dígitos do CPF."
            });
        }
        catch (erro)
        {
            console.log(erro);
            
            if (erro.code == 'ER_DUP_ENTRY')
            {
                return res.status(409).json({ mensagem: "Já existe um usuário cadastrado com este CPF ou Email." });
            }

            res.status(400).json({ mensagem: "Erro ao cadastrar usuário.", detalhe: erro.message });

        }
    }

    /**
     * Atualiza dados do usuário.
     * 
     * Método PUT: /usuarios/:cpf
     */
    async atualizar (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const cpfUrl = req.params.cpf;
            const { nome, email, senha, telefone, admin, empresa } = req.body;

            const usuarioAtualizado = new UsuarioModel(cpfUrl, nome, email, senha, telefone, admin, empresa);

            const sucesso = await dao.atualizar(usuarioAtualizado);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Usuário não encontrado para atualização." });
            }

            res.status(200).json({ mensagem: "Usuário atualizado com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao atualizar usuário.", detalhe: erro.message });
        }
    }

    /**
     * Remove um usuário.
     * 
     * Método DELETE: /usuarios/:cpf
     */
    async apagar (req, res)
    {
        const dao = new UsuarioDAO();

        try
        {
            const cpf = req.params.cpf;

            const sucesso = await dao.apagar(cpf);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Usuário não encontrado." });
            }

            res.status(200).json({ mensagem: "Usuário excluído com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);

            if (erro.code && erro.code.includes("ROW_IS_REFERENCED"))
            {
                return res.status(409).json({ mensagem: "Não é possível excluir este usuário pois ele possui atividades registradas." });
            }

            res.status(500).json({ mensagem: "Erro ao excluir usuário.", detalhe: erro.message });
        }
    }
}