import { pool } from '../db.js';
import { GrupoModel } from '../../model/GrupoModel.js';

export class GrupoDAO 
{
    /**
     * Cadastra um novo grupo.
     * 
     * @param {GrupoModel} grupo 
     * @returns {Promise<boolean>}
     */
    async criar (grupo) 
    {
        try 
        {
            const sql = 'INSERT INTO grupo (empresa, numero, nome) VALUES (?, ?, ?)';
            const values = [grupo.getEmpresa(), grupo.getNumero(), grupo.getNome()];

            const [result] = await pool.execute(sql, values);
            
            return result.affectedRows > 0;
        } 
        catch (error) 
        {
            console.error("Erro ao criar grupo:", error);

            throw error;
        }
    }

    /**
     * Atualiza o nome de um grupo.
     * A chave (empresa, numero) é usada no WHERE e não pode ser alterada aqui.
     * 
     * @param {GrupoModel} grupo 
     * @returns {Promise<boolean>}
     */
    async atualizar (grupo) 
    {
        try 
        {
            const sql = 'UPDATE grupo SET nome = ? WHERE empresa = ? AND numero = ?';

            // A ordem dos parâmetros é crucial: primeiro o SET, depois o WHERE
            const values = [grupo.getNome(), grupo.getEmpresa(), grupo.getNumero()];

            const [result] = await pool.execute(sql, values);
            
            return result.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao atualizar grupo:", error);

            throw error;
        }
    }

    /**
     * Remove um grupo.
     * Exige as duas chaves para identificar o registro único.
     * 
     * @param {number} idEmpresa 
     * @param {number} numeroGrupo 
     * @returns {Promise<boolean>}
     */
    async apagar (idEmpresa, numeroGrupo) 
    {
        try 
        {
            const sql = 'DELETE FROM grupo WHERE empresa = ? AND numero = ?';
            const [result] = await pool.execute(sql, [idEmpresa, numeroGrupo]);
            
            return result.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao deletar grupo:", error);

            throw error;
        }
    }

    /**
     * Lista TODOS os grupos de TODAS as empresas.
     * (Cuidado: Em sistemas reais, raramente usamos isso sem filtro)
     * 
     * @returns {Promise<GrupoModel[]>}
     */
    async buscarTodos () 
    {
        try 
        {
            const sql = 'SELECT * FROM grupo';
            const [linhas] = await pool.query(sql);

            return linhas.map(linha => new GrupoModel(
                linha.empresa, 
                linha.numero, 
                linha.nome
            ));
        } 
        catch (error) 
        {
            console.error("Erro ao listar todos os grupos:", error);

            throw error;
        }
    }

    /**
     * Busca todos os grupos de uma Empresa específica.
     * 
     * @param {number} idEmpresa
     * @returns {Promise<GrupoModel[]>}
     */
    async buscarPorEmpresa (idEmpresa) 
    {
        try
        {
            const sql = 'SELECT * FROM grupo WHERE empresa = ? ORDER BY numero ASC';
            const [linhas] = await pool.query(sql, [idEmpresa]);

            return linhas.map(linha => new GrupoModel(
                linha.empresa, 
                linha.numero, 
                linha.nome
            ));
        } 
        catch (error) 
        {
            console.error("Erro ao buscar grupos da empresa:", error);

            throw error;
        }
    }

    /**
     * Busca um grupo específico pela chave composta.
     * 
     * @param {number} idEmpresa 
     * @param {number} numeroGrupo 
     * @returns {Promise<GrupoModel|null>}
     */
    async buscarComposta (idEmpresa, numeroGrupo) 
    {
        try 
        {
            const sql = 'SELECT * FROM grupo WHERE empresa = ? AND numero = ?';
            const [linhas] = await pool.query(sql, [idEmpresa, numeroGrupo]);

            if (linhas.length === 0) return null;

            const linha = linhas[0];

            return new GrupoModel(linha.empresa, linha.numero, linha.nome);
            
        } 
        catch (error) 
        {
            console.error("Erro ao buscar grupo específico:", error);

            throw error;
        }
    }
}