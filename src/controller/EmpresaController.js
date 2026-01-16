import { EmpresaDAO } from '../database/DAO/EmpresaDAO.js';
import { EmpresaModel } from '../model/EmpresaModel.js';

export class EmpresaController
{
    /**
     * Renderiza a lista de empresas.
     * 
     * GET: /empresas
     */
    async listar (req, res)
    {
        const dao = new EmpresaDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            res.render('empresa/listar', { 
                lista: lista,
                erro: null 
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.render('empresa/listar', { 
                lista: [], 
                erro: "Erro ao carregar dados: " + erro.message 
            });
        }
    }

    /**
     * Renderiza o formulário de criação.
     * 
     * GET: /empresas/novo
     */
    async formCriar (req, res)
    {
        res.render('empresa/form', {
            acao: 'Criar',
            rota: '/empresas',
            empresa: null,
            erro: null
        });
    }

    /**
     * Renderiza o formulário de edição.
     * 
     * GET: /empresas/editar/:id
     */
    async formEditar (req, res)
    {
        const dao = new EmpresaDAO();
        try
        {
            const id = req.params.id;
            const empresa = await dao.buscarPorId(id);

            if (!empresa) 
            {
                return res.redirect('/empresas');
            }

            res.render('empresa/form', {
                acao: 'Editar',
                rota: `/empresas/${id}?method=PUT`,
                empresa: empresa,
                erro: null
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/empresas');
        }
    }

    /**
     * Processa a criação.
     * 
     * POST: /empresas
     */
    async criar (req, res)
    {
        const dao = new EmpresaDAO();

        try
        {
            const { nome, cidade, estado } = req.body;
            const novaEmpresa = new EmpresaModel(null, nome, cidade, estado);

            await dao.criar(novaEmpresa);

            res.redirect('/empresas');
        }
        catch (erro)
        {
            console.log(erro);
            res.render('empresa/form', {
                acao: 'Criar',
                rota: '/empresas',
                empresa: { nome: req.body.nome, cidade: req.body.cidade, estado: req.body.estado },
                erro: "Erro ao cadastrar: " + erro.message
            });
        }
    }

    /**
     * Processa a atualização.
     * 
     * PUT: /empresas/:id
     */
    async atualizar (req, res)
    {
        const dao = new EmpresaDAO();
        const id = req.params.id;

        try
        {
            const { nome, cidade, estado } = req.body;
            const empresaAtualizada = new EmpresaModel(id, nome, cidade, estado);

            await dao.atualizar(empresaAtualizada);

            res.redirect('/empresas');
        }
        catch (erro)
        {
            console.log(erro);
            res.render('empresa/form', {
                acao: 'Editar',
                rota: `/empresas/${id}?method=PUT`,
                empresa: { id: id, nome: req.body.nome, cidade: req.body.cidade, estado: req.body.estado },
                erro: "Erro ao atualizar: " + erro.message
            });
        }
    }

    /**
     * Apaga uma empresa.
     * 
     * DELETE: /empresas/:id
     */
    async apagar (req, res)
    {
        const dao = new EmpresaDAO();

        try
        {
            const id = req.params.id;
            await dao.apagar(id);

            res.redirect('/empresas');
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/empresas');
        }
    }
}