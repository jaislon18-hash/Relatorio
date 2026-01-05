import { pool } from '../db.js';
import { ClassificacaoModel } from '../../model/ClassificacaoModel.js';

export class ClassificacaoDAO 
{
    /**
     * Cadastra um novo tipo de classificação.
     * 
     * @param {ClassificacaoModel} classificacao 
     * @returns {Promise<boolean>}
     */
    async criar (classificacao) 
    {
        try 
        {
            const sql = 'INSERT INTO classificacao (nome) VALUES (?)';

            const valores = [classificacao.getNome()];

            const [resultado] = await pool.execute(sql, valores);
            
            classificacao.setId(resultado.insertId);
            
            return resultado.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao criar classificação:", error);

            throw error;
        }
    }

    /**
     * Atualiza a descrição de uma classificação.
     * 
     * @param {ClassificacaoModel} classificacao 
     * @returns {Promise<boolean>}
     */
    async atualizar (classificacao) 
    {
        try 
        {
            const sql = 'UPDATE classificacao SET nome = ? WHERE id = ?';

            const valores = [classificacao.getNome(), classificacao.getId()];

            const [resultado] = await pool.execute(sql, valores);
            
            return resultado.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao atualizar classificação:", error);

            throw error;
        }
    }

    /**
     * Remove uma classificação.
     * 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async apagar (id) 
    {
        try 
        {
            const sql = 'DELETE FROM classificacao WHERE id = ?';

            const [resultado] = await pool.execute(sql, [id]);
            
            return resultado.affectedRows > 0;

        } 
        catch (error) 
        { 
            console.error("Erro ao deletar classificação:", error);

            throw error;
        }
    }

    /**
     * Lista todas as classificações disponíveis.
     * 
     * @returns {Promise<ClassificacaoModel[]>}
     */
    async buscarTodos () 
    {
        try 
        {
            const sql = 'SELECT * FROM classificacao ORDER BY nome ASC';

            const [linhas] = await pool.query(sql);

            return linhas.map(linha => new ClassificacaoModel(
                linha.id, 
                linha.nome
            ));

        } 
        catch (error) 
        {
            console.error("Erro ao listar classificações:", error);

            throw error;
        }
    }

    /**
     * Busca uma classificação específica pelo ID.
     * 
     * @param {number} id 
     * @returns {Promise<ClassificacaoModel|null>}
     */
    async buscarPorId (id) 
    {
        try 
        {
            const sql = 'SELECT * FROM classificacao WHERE id = ?';

            const [rows] = await pool.query(sql, [id]);

            if (rows.length === 0) return null;

            const row = rows[0];

            return new ClassificacaoModel(row.id, row.nome);

        } 
        catch (error) 
        {
            console.error("Erro ao buscar classificação:", error);

            throw error;
        }
    }
}