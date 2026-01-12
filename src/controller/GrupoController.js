import { GrupoDAO } from '../database/DAO/GrupoDAO.js';
import { GrupoModel } from '../model/GrupoModel.js';

export class GrupoController
{
    /**
     * Lista TODOS os grupos do sistema.
     * 
     * Método GET: /grupos
     */
    async listar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const lista = await dao.buscarTodos();

            res.status(200).json(lista);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao listar grupos.", detalhe: erro.message });

        }
    }

    /**
     * Lista apenas os grupos de uma EMPRESA específica.
     * 
     * Método GET: /grupos/empresa/:idEmpresa
     */
    async listarPorEmpresa (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const idEmpresa = req.params.idEmpresa;
            
            const lista = await dao.buscarPorEmpresa(idEmpresa);

            res.status(200).json(lista);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar grupos da empresa.", detalhe: erro.message });

        }
    }

    /**
     * Busca um grupo específico.
     * Precisamos de DUAS chaves aqui.
     * 
     * Método GET: /grupos/:idEmpresa/:numero
     */
    async buscarPorChave (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            // Pegamos os dois parâmetros da URL
            const idEmpresa = req.params.idEmpresa;
            const numero = req.params.numero;

            const grupo = await dao.buscarComposta(idEmpresa, numero);

            if (!grupo)
            {
                return res.status(404).json({ mensagem: "Grupo não encontrado." });
            }

            res.status(200).json(grupo);

        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar grupo.", detalhe: erro.message });
        }
    }

    /**
     * Cria um novo grupo.
     * 
     * Método POST: /grupos
     */
    async criar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            // O número do grupo não é automático, usuário define
            const { empresa, numero, nome } = req.body;

            const novoGrupo = new GrupoModel(empresa, numero, nome);

            await dao.criar(novoGrupo);

            res.status(201).json({ 
                mensagem: "Grupo criado com sucesso!", 
                dados: novoGrupo 
            });

        }
        catch (erro)
        {
            console.log(erro);
            
            // Tratamento específico para chave duplicada (Ex: Já existe Grupo 10 na Empresa 1)
            if (erro.code == 'ER_DUP_ENTRY')
            {
                return res.status(409).json({ mensagem: "Já existe um grupo com este número nesta empresa." });
            }

            res.status(400).json({ mensagem: "Erro ao cadastrar grupo.", detalhe: erro.message });
        }
    }

    /**
     * Atualiza o nome do grupo.
     * As chaves (empresa e numero) vêm na URL, o nome vem no corpo.
     * 
     * Método PUT: /grupos/:idEmpresa/:numero
     */
    async atualizar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const idEmpresa = req.params.idEmpresa;
            const numero = req.params.numero;
            
            const { nome } = req.body;

            // Instanciamos o model para validar tudo junto
            const grupoAtualizado = new GrupoModel(idEmpresa, numero, nome);

            const sucesso = await dao.atualizar(grupoAtualizado);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Grupo não encontrado para atualização." });
            }

            res.status(200).json({ mensagem: "Grupo atualizado com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao atualizar grupo.", detalhe: erro.message });
        }
    }

    /**
     * Apaga um grupo.
     * 
     * Método DELETE: /grupos/:idEmpresa/:numero
     */
    async apagar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const idEmpresa = req.params.idEmpresa;
            const numero = req.params.numero;

            const sucesso = await dao.apagar(idEmpresa, numero);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Grupo não encontrado." });
            }

            res.status(200).json({ mensagem: "Grupo excluído com sucesso!" });

        }
        catch (erro)
        {
            console.log(erro);

            // Verifica se tem atividades vinculadas antes de deixar apagar
            if (erro.code && erro.code.includes("ROW_IS_REFERENCED"))
            {
                return res.status(409).json({ mensagem: "Não é possível excluir este grupo pois existem atividades vinculadas a ele." });
            }
            
            res.status(500).json({ mensagem: "Erro ao excluir grupo.", detalhe: erro.message });
        }
    }
}