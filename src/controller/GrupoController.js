import { GrupoModel } from "../model/GrupoModel";
import { GrupoDAO } from "../database/DAO/GrupoDAO.js";

export class GrupoController
{
    async listar (req, res)
    {
        const dao = new GrupoDAO();

        try
        {
            const listas = await dao.buscarTodos();

            res.status(200).json(listas);
        }
        catch(error)
        {
            console.log(error);
            res.status(500).json({mensagem: "Erro ao listar grupos.", erro: error.message});
        }
    }
    async listaComposta (req, res)
    {
        const dao = new GrupoDAO();
        try
        {
            const idEmpresa = parseInt(req.params.idEmpresa);
            const numero = parseInt (req.params.numeroGrupo);
            const grupo = await dao.buscarComposta(idEmpresa, numero);
            res.status(200).json(grupo);
        }
        catch(error)
        {
            console.log(error);
            res.status(500).jspml({mensagem: "Erro ao buscar grupo.", erro: error.message});
        }
    }
    async criar ()
    {
        const dao = new GrupoDAO();
        try
        {
            const {empresa, numero, nome} = req.body;

            const novoGrupo = new GrupoModel(empresa, numero, nome);

            await dao.criar(novoGrupo);

            res.status(201).json({mensagem: "Grupo criado com sucesso.", grupo: novoGrupo});

        }
        catch(error)
        {
            console.log(error);
            if(error.code == 'ER_DUP_ENTRY')
            {
                res.status(409).json({mensagem: "Já existe um grupo com esse número para a empresa informada."});
            }
            if(error.code == 'ER_NO_REFERENCED_ROW_2')
            {
                res.status(400).json({mensagem: "Empresa informada não existe."});
            }
            res.status(500).json({mensagem: "Erro ao criar grupo.", erro: error.message});
        }
    }

}