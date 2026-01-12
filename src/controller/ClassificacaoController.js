import { ClassificacaoDAO } from '../database/DAO/ClassificacaoDAO.js';
import { ClassificacaoModel } from '../model/ClassificacaoModel.js';

export class ClassificacaoController
{
    /**
     * Lista todas as classificações (Tipos de Atividade).
     * 
     * Método GET: /classificacoes
     */
    async listar (req, res)
    {
        const dao = new ClassificacaoDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            res.status(200).json(lista);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao carregar as classificações.", detalhe: erro.message });
        }
    }

    /**
     * Busca uma classificação pelo ID.
     * 
     * Método GET: /classificacoes/:id
     */
    async buscarPorId (req, res)
    {
        const dao = new ClassificacaoDAO();
         
        try
        {
            const id = req.params.id;
            const classificacao = await dao.buscarPorId(id);

            if (!classificacao)
            {
                return res.status(404).json({ mensagem: "Classificação não encontrada." });
            }

            res.status(200).json(classificacao);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar classificação.", detalhe: erro.message });
        }
    }

    /**
     * Cria uma nova classificação.
     * 
     * Método POST: /classificacoes
     */
    async criar (req, res)
    {
        const dao = new ClassificacaoDAO();

        try
        {
            // aqui só precisamos do nome, pois o ID é automático.
            const { nome } = req.body;

            const novaClassificacao = new ClassificacaoModel(null, nome);

            await dao.criar(novaClassificacao);

            res.status(201).json({ 
                mensagem: "Classificação criada com sucesso!", 
                dados: novaClassificacao 
            });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao cadastrar classificação.", detalhe: erro.message });
        }
    }

    /**
     * Atualiza o nome da classificação.
     * 
     * Método PUT: /classificacoes/:id
     */
    async atualizar (req, res)
    {
        const dao = new ClassificacaoDAO();

        try
        {
            const id = req.params.id;

            const { nome } = req.body;

            const classificacaoAtualizada = new ClassificacaoModel(id, nome);

            const sucesso = await dao.atualizar(classificacaoAtualizada);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Classificação não encontrada." });
            }

            res.status(200).json({ mensagem: "Classificação atualizada com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao atualizar.", detalhe: erro.message });
        }
    }

    /**
     * Apaga uma classificação.
     * 
     * Método DELETE: /classificacoes/:id
     */
    async apagar (req, res)
    {
        const dao = new ClassificacaoDAO();

        try
        {
            const id = req.params.id;

            const sucesso = await dao.apagar(id);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Classificação não encontrada." });
            }

            res.status(200).json({ mensagem: "Classificação excluída com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);
            
            // o erro mais comum vai ser tentar apagar algo que já está em uso
            // se o erro for relacionado a chave estrangeira (FK), avisamos o usuário
            if (erro.code && erro.code.includes("ROW_IS_REFERENCED"))
            {
                return res.status(409).json({ mensagem: "Não é possível excluir esta classificação pois existem atividades vinculadas a ela." });
            }

            res.status(500).json({ mensagem: "Erro ao excluir classificação.", detalhe: erro.message });

        }
    }
}