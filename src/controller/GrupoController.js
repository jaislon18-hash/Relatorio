import { GrupoDAO } from '../database/DAO/GrupoDAO.js';
import { GrupoModel } from '../model/GrupoModel.js';
import { EmpresaDAO } from '../database/DAO/EmpresaDAO.js'; // Necessário para o <select> de empresas

export class GrupoController
{
    /**
     * Renderiza a lista de grupos.
     * 
     * GET: /grupos
     */
    async listar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const lista = await dao.buscarTodos();
            
            res.render('grupo/listar', { 
                lista: lista,
                erro: null 
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.render('grupo/listar', { 
                lista: [], 
                erro: "Erro ao carregar dados: " + erro.message 
            });
        }
    }

    /**
     * Renderiza o formulário de criação.
     * 
     * GET: /grupos/novo
     */
    async formCriar (req, res)
    {
        try 
        {
            const empresaDAO = new EmpresaDAO();
            const empresas = await empresaDAO.buscarTodos();

            res.render('grupo/form', {
                acao: 'Criar',
                rota: '/grupos',
                grupo: null,
                empresas: empresas, 
                erro: null
            });
        }
        catch (erro)
        {
            res.redirect('/grupos');
        }
    }

    /**
     * Renderiza o formulário de edição.
     * 
     * GET: /grupos/editar/:idEmpresa/:numero
     */
    async formEditar (req, res)
    {
        try
        {
            const idEmpresa = req.params.idEmpresa;
            const numero = req.params.numero;

            const dao = new GrupoDAO();
            const empresaDAO = new EmpresaDAO();

            const grupo = await dao.buscarComposta(idEmpresa, numero);
            const empresas = await empresaDAO.buscarTodos();

            if (!grupo) return res.redirect('/grupos');

            res.render('grupo/form', {
                acao: 'Editar',
                rota: `/grupos/${idEmpresa}/${numero}?method=PUT`,
                grupo: grupo,
                empresas: empresas,
                erro: null
            });
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/grupos');
        }
    }

    /**
     * Processa a criação.
     * 
     * POST: /grupos
     */
    async criar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const { empresa, numero, nome } = req.body;
            const novoGrupo = new GrupoModel(empresa, numero, nome);

            await dao.criar(novoGrupo);

            res.redirect('/grupos');
        }
        catch (erro)
        {
            console.log(erro);
            
            const empresaDAO = new EmpresaDAO();
            const empresas = await empresaDAO.buscarTodos();

            let msg = "Erro ao cadastrar: " + erro.message;
            if (erro.code == 'ER_DUP_ENTRY') msg = "Já existe um Grupo com este número nesta Empresa.";

            res.render('grupo/form', {
                acao: 'Criar',
                rota: '/grupos',
                grupo: { empresa: req.body.empresa, numero: req.body.numero, nome: req.body.nome },
                empresas: empresas,
                erro: msg
            });
        }
    }

    /**
     * Processa a atualização.
     * 
     * PUT: /grupos/:idEmpresa/:numero
     */
    async atualizar (req, res)
    {
        const dao = new GrupoDAO();

        const idEmpresa = req.params.idEmpresa;
        const numero = req.params.numero;

        try
        {
            const { nome } = req.body;
            
            const grupoAtualizado = new GrupoModel(idEmpresa, numero, nome);

            await dao.atualizar(grupoAtualizado);

            res.redirect('/grupos');
        }
        catch (erro)
        {
            console.log(erro);
            res.send("Erro ao atualizar: " + erro.message); 
        }
    }

    /**
     * Apaga um grupo.
     * 
     * DELETE: /grupos/:idEmpresa/:numero
     */
    async apagar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const idEmpresa = req.params.idEmpresa;
            const numero = req.params.numero;

            await dao.apagar(idEmpresa, numero);

            res.redirect('/grupos');
        }
        catch (erro)
        {
            console.log(erro);
            res.redirect('/grupos');
        }
    }
}