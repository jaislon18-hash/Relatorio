import { EmpresaDAO } from '../database/DAO/EmpresaDAO.js';
import { EmpresaModel } from '../model/EmpresaModel.js';

export class EmpresaController
{
    /**
     * Lista todas as empresas cadastradas.
     * 
     * Método GET: /empresas
     */
    async listar (req, res)
    {
        // Instanciamos o DAO para acessar o banco
        const dao = new EmpresaDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            // Retornamos a lista com status 200 (OK)
            res.status(200).json(lista);
        }
        catch (erro)
        { 
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao listar empresas.", detalhe: erro.message });
        }
    }

    /**
     * Busca uma empresa específica pelo ID.
     * 
     * Método GET: /empresas/:id
     */
    async buscarPorId (req, res)
    {
        const dao = new EmpresaDAO();
        
        try
        {
            // O ID vem pela URL (ex: /empresas/1), então pegamos do req.params
            const id = req.params.id;

            const empresa = await dao.buscarPorId(id);

            if (!empresa)
            {
                // Se não achou, retornamos 404 (Not Found)
                return res.status(404).json({ mensagem: "Empresa não encontrada." });
            }

            res.status(200).json(empresa);
        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao buscar a empresa.", detalhe: erro.message });
        }
    }

    /**
     * Cadastra uma nova empresa.
     * 
     * Método POST: /empresas
     */
    async criar (req, res)
    {
        const dao = new EmpresaDAO();

        try
        {
            // Desestruturação: pegamos os dados que vieram no corpo da requisição (JSON)
            const { nome, cidade, estado } = req.body;

            // Criamos o Model. 
            // Atenção: Passamos null no ID porque o banco vai gerar isso pra gente (Auto Increment).
            // Se os dados estiverem errados (ex: nome vazio), o Model vai disparar um erro aqui
            const novaEmpresa = new EmpresaModel(null, nome, cidade, estado);

            await dao.criar(novaEmpresa);

            // Retornamos 201 (Created) e o objeto criado (agora com ID)
            res.status(201).json({ 
                mensagem: "Empresa criada com sucesso!", 
                dados: novaEmpresa 
            });

        }
        catch (erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao cadastrar empresa.", detalhe: erro.message });
        }
    }

    /**
     * Atualiza os dados de uma empresa.
     * 
     * Método PUT: /empresas/:id
     */
    async atualizar (req, res)
    {
        const dao = new EmpresaDAO();

        try
        {
            // Pegamos o ID da URL e os novos dados do Body
            const id = req.params.id;
            const { nome, cidade, estado } = req.body;

            // Instanciamos o Model já com o ID para fazer a validação completa
            const empresaAtualizada = new EmpresaModel(id, nome, cidade, estado);

            const sucesso = await dao.atualizar(empresaAtualizada);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Empresa não encontrada para atualização." });
            }

            res.status(200).json({ mensagem: "Empresa atualizada com sucesso!" });
        }
        catch (erro)
        {
            console.log(erro);

            res.status(400).json({ mensagem: "Erro ao atualizar empresa.", detalhe: erro.message });
        }
    }

    /**
     * Exclui uma empresa.
     * 
     * Método DELETE: /empresas/:id
     */
    async apagar (req, res)
    {
        const dao = new EmpresaDAO();

        try
        {
            const id = req.params.id;

            const sucesso = await dao.apagar(id);

            if (!sucesso)
            {
                return res.status(404).json({ mensagem: "Empresa não encontrada para exclusão." });
            }

            res.status(200).json({ mensagem: "Empresa excluída com sucesso!" });
        }
        catch (erro)
        {
            console.log(erro);

            res.status(500).json({ mensagem: "Erro ao excluir empresa. Verifique se há usuários vinculados.", detalhe: erro.message });
        }
    }
}