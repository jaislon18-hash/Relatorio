import { AtividadeDAO } from '../database/DAO/AtividadeDAO.js';
import { AtividadeModel } from '../model/AtividadeModel.js';

export class AtividadeController
{
    /**
     * Lista todas as atividades registradas.
     * 
     * Método GET: /atividades
     */
    async listar (req, res)
    {
        const dao = new AtividadeDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            res.status(200).json(lista);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao listar as atividades.", detalhe: erro.message });

        }
    }

    /**
     * Busca uma atividade específica pelo ID.
     * 
     * Método GET: /atividades/:id
     */
    async buscarPorId (req, res)
    {
        const dao = new AtividadeDAO();
        
        try
        {
            const id = req.params.id;
            
            const atividade = await dao.buscarPorId(id);

            if (!atividade)
            {
                return res.status(404).json({ mensagem: "Atividade não encontrada." });
            }

            res.status(200).json(atividade);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar a atividade.", detalhe: erro.message });

        }
    }

    /**
     * Registra uma nova atividade de produtividade.
     * 
     * Método POST: /atividades
     */
    async criar (req, res)
    {
        const dao = new AtividadeDAO();

        try
        {
            const { 
                classificacao, 
                grupoEmpresa, 
                grupoNumero, 
                mes, 
                ano, 
                participou, 
                horas, 
                qtdestudos, 
                observacao 
            } = req.body;

            const novaAtividade = new AtividadeModel(
                null, 
                classificacao, 
                grupoEmpresa, 
                grupoNumero, 
                mes, 
                ano, 
                participou, 
                horas, 
                qtdestudos, 
                observacao
            );

            await dao.criar(novaAtividade);

            res.status(201).json({ 
                mensagem: "Atividade registrada com sucesso!", 
                dados: novaAtividade 
            });

        }
        catch (erro)
        {
            console.log(erro);
            
            if (erro.code && erro.code.includes("NO_REFERENCED_ROW"))
            {
                return res.status(400).json({ mensagem: "Erro de Vínculo: A Classificação ou o Grupo informado não existem." });
            }

            res.status(400).json({ mensagem: "Erro ao registrar atividade.", detalhe: erro.message });

        }
    }

    /**
     * Atualiza os dados de uma atividade existente.
     * 
     * Método PUT: /atividades/:id
     */
    async atualizar (req, res)
    {
        const dao = new AtividadeDAO();

        try
        {
            const id = req.params.id;
            
            const { 
                classificacao, 
                grupoEmpresa, 
                grupoNumero, 
                mes, 
                ano, 
                participou, 
                horas, 
                qtdestudos, 
                observacao 
            } = req.body;

            const atividadeAtualizada = new AtividadeModel(
                id, 
                classificacao, 
                grupoEmpresa, 
                grupoNumero, 
                mes, 
                ano, 
                participou, 
                horas, 
                qtdestudos, 
                observacao
            );

            const sucesso = await dao.atualizar(atividadeAtualizada);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Atividade não encontrada para atualização." });
            }

            res.status(200).json({ mensagem: "Atividade atualizada com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao atualizar atividade.", detalhe: erro.message });

        }
    }

    /**
     * Exclui um registro de atividade.
     * 
     * Método DELETE: /atividades/:id
     */
    async apagar (req, res)
    {
        const dao = new AtividadeDAO();
        
        try
        {
            const id = req.params.id;

            const sucesso = await dao.apagar(id);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Atividade não encontrada." });
            }

            res.status(200).json({ mensagem: "Atividade excluída com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao excluir atividade.", detalhe: erro.message });

        }
    }
}