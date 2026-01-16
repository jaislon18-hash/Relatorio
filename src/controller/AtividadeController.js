import { AtividadeDAO } from '../database/DAO/AtividadeDAO.js';
import { AtividadeModel } from '../model/AtividadeModel.js';
// Importamos os DAOs auxiliares para preencher os selects (combobox)
import { ClassificacaoDAO } from '../database/DAO/ClassificacaoDAO.js';
import { GrupoDAO } from '../database/DAO/GrupoDAO.js';

export class AtividadeController
{
    /**
     * Renderiza a lista de atividades.
     * 
     * GET: /atividades
     */
    async listar (req, res)
    {
        const dao = new AtividadeDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            // Renderiza a view 'listar.ejs' passando os dados
            res.render('atividade/listar', { 
                lista: lista,
                mensagem: null,
                erro: null 
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.render('atividade/listar', { 
                lista: [], 
                mensagem: null, 
                erro: "Erro ao carregar dados: " + erro.message 
            });
        }
    }

    /**
     * Renderiza o formulário de criação.
     * 
     * GET: /atividades/novo
     */
    async formCriar (req, res)
    {
        try
        {
            const classificacaoDAO = new ClassificacaoDAO();
            const grupoDAO = new GrupoDAO();

            // Busca dados para popular os selects
            const classificacoes = await classificacaoDAO.buscarTodos();
            const grupos = await grupoDAO.buscarTodos();

            res.render('atividade/form', {
                acao: 'Criar',
                rota: '/atividades', 
                atividade: null,
                classificacoes,
                grupos,
                erro: null
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/atividades');
        }
    }

    /**
     * Renderiza o formulário de edição.
     * 
     * GET: /atividades/editar/:id
     */
    async formEditar (req, res)
    {
        try
        {
            const id = req.params.id;
            const dao = new AtividadeDAO();
            const classificacaoDAO = new ClassificacaoDAO();
            const grupoDAO = new GrupoDAO();

            const atividade = await dao.buscarPorId(id);
            const classificacoes = await classificacaoDAO.buscarTodos();
            const grupos = await grupoDAO.buscarTodos();

            if (!atividade) return res.redirect('/atividades');

            res.render('atividade/form', {
                acao: 'Editar',
                // adicionamos ?method=PUT na URL da action (assista a aula 09 para entender o motivo)
                rota: `/atividades/${id}?method=PUT`, 
                atividade,
                classificacoes,
                grupos,
                erro: null
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/atividades');
        }
    }

    /**
     * Processa a criação (Form Action).
     * 
     * POST: /atividades
     */
    async criar (req, res)
    {
        const dao = new AtividadeDAO();

        try
        {
            const { classificacao, grupoComposto, mes, ano, participou, horas, qtdestudos, observacao } = req.body;

            // Lógica para separar o ID composto do Grupo (ex: "1|10" -> empresa:1, numero:10)
            const [grupoEmpresa, grupoNumero] = grupoComposto.split('|');

            const novaAtividade = new AtividadeModel(
                null, 
                classificacao, 
                grupoEmpresa, 
                grupoNumero, 
                mes, 
                ano, 
                // HTML envia 'on' se marcado, ou undefined se não.
                participou ? 1 : 0, 
                horas, 
                qtdestudos, 
                observacao
            );

            await dao.criar(novaAtividade);

            res.redirect('/atividades');
        }
        catch (erro)
        {
            console.log(erro);
            res.status(400).send("Erro ao cadastrar: " + erro.message);
        }
    }

    /**
     * Processa a atualização.
     * 
     * PUT: /atividades/:id
     */
    async atualizar (req, res)
    {
        const dao = new AtividadeDAO();

        try
        {
            const id = req.params.id;
            const { classificacao, grupoComposto, mes, ano, participou, horas, qtdestudos, observacao } = req.body;

            const [grupoEmpresa, grupoNumero] = grupoComposto.split('|');

            const atividadeAtualizada = new AtividadeModel(
                id, 
                classificacao, 
                grupoEmpresa, 
                grupoNumero, 
                mes, 
                ano, 
                participou ? 1 : 0, 
                horas, 
                qtdestudos, 
                observacao
            );

            await dao.atualizar(atividadeAtualizada);

            res.redirect('/atividades');
        }
        catch (erro)
        {
            console.log(erro);
            res.send("Erro ao atualizar: " + erro.message);
        }
    }

    /**
     * Exclui um registro.
     * 
     * DELETE: /atividades/:id
     */
    async apagar (req, res)
    {
        const dao = new AtividadeDAO();
        try
        {
            const id = req.params.id;
            await dao.apagar(id);
            
            res.redirect('/atividades');
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/atividades');
        }
    }
}