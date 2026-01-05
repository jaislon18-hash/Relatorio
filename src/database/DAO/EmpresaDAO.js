import { pool } from '../db.js'; // Assumindo que sua conexão está aqui
import { EmpresaModel } from '../../model/EmpresaModel.js';

export class EmpresaDAO 
{
    /**
     * Insere uma nova empresa no banco.
     * 
     * @param {EmpresaModel} empresa 
     * @returns {Promise<boolean>} Retorna true se inseriu com sucesso
     */
    async criar (empresa) 
    {
        try 
        {
            const sql = 'INSERT INTO empresa (nome, cidade, estado) VALUES (?, ?, ?)';

            // Usamos os Getters do Model para pegar os dados validados
            const valores = [empresa.getNome(), empresa.getCidade(), empresa.getEstado()];

            const [resultado] = await pool.execute(sql, valores);
            
            // Opcional: Atualizar o ID do objeto com o ID gerado pelo banco (para ficar na memória)
            empresa.setId(resultado.insertId);
            
            return resultado.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao criar empresa:", error);
            
            throw error;
        }
    }

    /**
     * Atualiza os dados de uma empresa existente.
     * 
     * @param {EmpresaModel} empresa 
     * @returns {Promise<boolean>}
     */
    async atualizar (empresa) 
    {
        try 
        {
            const sql = 'UPDATE empresa SET nome = ?, cidade = ?, estado = ? WHERE id = ?';

            const valores = [empresa.getNome(), empresa.getCidade(), empresa.getEstado(), empresa.getId()];

            const [resultado] = await pool.execute(sql, valores);
            
            return resultado.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao atualizar empresa:", error);
            throw error;
        }
    }

    /**
     * Remove uma empresa pelo ID.
     * 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async apagar (id) 
    {
        try 
        {
            const sql = 'DELETE FROM empresa WHERE id = ?';

            const [resultado] = await pool.execute(sql, [id]);
            
            return resultado.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao deletar empresa:", error);

            throw error;
        }
    }

    /**
     * Busca todas as empresas.
     * 
     * @returns {Promise<EmpresaModel[]>} Lista de objetos EmpresaModel
     */
    async buscarTodos () 
    {
        try 
        {
            const sql = 'SELECT * FROM empresa';

            const [linhas] = await pool.query(sql);

            return linhas.map(linha => new EmpresaModel(
                linha.id, 
                linha.nome, 
                linha.cidade, 
                linha.estado
            ));

        } 
        catch (error) 
        {
            console.error("Erro ao listar empresas:", error);

            throw error;
        }
    }

    /**
     * Busca uma empresa pelo ID.
     * 
     * @param {number} id 
     * @returns {Promise<EmpresaModel|null>} Objeto encontrado ou null
     */
    async buscarPorId (id) 
    {
        try 
        {
            const sql = 'SELECT * FROM empresa WHERE id = ?';

            const [linhas] = await pool.query(sql, [id]);

            if (linhas.length === 0) return null;

            const linha = linhas[0];

            return new EmpresaModel(linha.id, linha.nome, linha.cidade, linha.estado);

        } 
        catch (error) 
        {
            console.error("Erro ao buscar empresa:", error);

            throw error;
        }
    }
}