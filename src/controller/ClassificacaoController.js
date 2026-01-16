import { ClassificacaoDAO } from '../database/DAO/ClassificacaoDAO.js';
import { ClassificacaoModel } from '../model/ClassificacaoModel.js';

export class ClassificacaoController
{
    /**
     * Renderiza a lista de classificações.
     * 
     * GET: /classificacoes
     */
    async listar (req, res)
    {
        const dao = new ClassificacaoDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            res.render('classificacao/listar', { 
                lista: lista,
                erro: null 
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.render('classificacao/listar', { 
                lista: [], 
                erro: "Erro ao carregar dados: " + erro.message 
            });
        }
    }

    /**
     * Renderiza o formulário de criação.
     * 
     * GET: /classificacoes/novo
     */
    async formCriar (req, res)
    {
        res.render('classificacao/form', {
            acao: 'Criar',
            rota: '/classificacoes',
            classificacao: null,
            erro: null
        });
    }

    /**
     * Renderiza o formulário de edição.
     * 
     * GET: /classificacoes/editar/:id
     */
    async formEditar (req, res)
    {
        const dao = new ClassificacaoDAO();
        try
        {
            const id = req.params.id;
            const classificacao = await dao.buscarPorId(id);

            if (!classificacao) 
            {
                return res.redirect('/classificacoes');
            }

            res.render('classificacao/form', {
                acao: 'Editar',
                rota: `/classificacoes/${id}?method=PUT`,
                classificacao: classificacao,
                erro: null
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/classificacoes');
        }
    }

    /**
     * Processa a criação.
     * 
     * POST: /classificacoes
     */
    async criar (req, res)
    {
        const dao = new ClassificacaoDAO();

        try
        {
            const { nome } = req.body;
            const novaClassificacao = new ClassificacaoModel(null, nome);

            await dao.criar(novaClassificacao);

            res.redirect('/classificacoes');
        }
        catch (erro)
        {
            console.log(erro);
            res.render('classificacao/form', {
                acao: 'Criar',
                rota: '/classificacoes',
                classificacao: { nome: req.body.nome }, 
                erro: "Erro ao cadastrar: " + erro.message
            });
        }
    }

    /**
     * Processa a atualização.
     * 
     * PUT: /classificacoes/:id
     */
    async atualizar (req, res)
    {
        const dao = new ClassificacaoDAO();
        const id = req.params.id;

        try
        {
            const { nome } = req.body;
            const classificacaoAtualizada = new ClassificacaoModel(id, nome);

            await dao.atualizar(classificacaoAtualizada);

            res.redirect('/classificacoes');
        }
        catch (erro)
        {
            console.log(erro);
            res.render('classificacao/form', {
                acao: 'Editar',
                rota: `/classificacoes/${id}?method=PUT`,
                classificacao: { id: id, nome: req.body.nome },
                erro: "Erro ao atualizar: " + erro.message
            });
        }
    }

    /**
     * Apaga uma classificação.
     * 
     * DELETE: /classificacoes/:id
     */
    async apagar (req, res)
    {
        const dao = new ClassificacaoDAO();

        try
        {
            const id = req.params.id;
            await dao.apagar(id);

            res.redirect('/classificacoes');
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/classificacoes');
        }
    }
}