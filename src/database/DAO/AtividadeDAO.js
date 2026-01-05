import { pool } from '../db.js';
import { AtividadeModel } from '../../model/AtividadeModel.js';

export class AtividadeDAO 
{
    /**
     * Registra uma nova atividade.
     * 
     * @param {AtividadeModel} atividade 
     * @returns {Promise<boolean>}
     */
    async criar (atividade) 
    {
        try 
        {
            const sql = `INSERT INTO atividade (classificacao, grupo_empresa, grupo_numero, mes, ano, participou, horas, qtdestudos, observacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            const valores = [
                atividade.getClassificacao(),
                atividade.getGrupoEmpresa(),
                atividade.getGrupoNumero(),
                atividade.getMes(),
                atividade.getAno(),
                atividade.getParticipou(),
                atividade.getHoras(),       
                atividade.getQtdEstudos(),  
                atividade.getObservacao()
            ];

            const [resultado] = await pool.execute(sql, valores);
            
            atividade.setId(resultado.insertId);
            
            return resultado.affectedRows > 0;
        } 
        catch (error) 
        {
            console.error("Erro ao registrar atividade:", error);

            throw error;
        }
    }

    /**
     * Atualiza uma atividade existente.
     * 
     * @param {AtividadeModel} atividade 
     * @returns {Promise<boolean>}
     */
    async atualizar (atividade) 
    {
        try 
        {
            const sql = `UPDATE atividade SET classificacao = ?, grupo_empresa = ?, grupo_numero = ?, mes = ?, ano = ?, participou = ?, horas = ?, qtdestudos = ?, observacao = ? WHERE id = ?`;
            
            const valores = [
                atividade.getClassificacao(),
                atividade.getGrupoEmpresa(),
                atividade.getGrupoNumero(),
                atividade.getMes(),
                atividade.getAno(),
                atividade.getParticipou(),
                atividade.getHoras(),
                atividade.getQtdEstudos(),
                atividade.getObservacao(),
                atividade.getId() 
            ];

            const [resultado] = await pool.execute(sql, valores);
            
            return resultado.affectedRows > 0;
        } 
        catch (error) 
        {
            console.error("Erro ao atualizar atividade:", error);

            throw error;
        }
    }

    /**
     * Remove uma atividade pelo ID.
     * 
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async apagar (id) 
    {
        try 
        {
            const sql = 'DELETE FROM atividade WHERE id = ?';
            
            const [resultado] = await pool.execute(sql, [id]);
            
            return resultado.affectedRows > 0;

        } 
        catch (error) 
        {
            console.error("Erro ao deletar atividade:", error);

            throw error;
        }
    }

    /**
     * Lista todas as atividades registradas no sistema.
     * 
     * @returns {Promise<AtividadeModel[]>}
     */
    async buscarTodos () 
    {
        try 
        {
            const sql = 'SELECT * FROM atividade ORDER BY ano DESC, mes DESC';
            
            const [linhas] = await pool.query(sql);

            return linhas.map(linha => this.converterLinhaModel(linha));

        } 
        catch (error) 
        {
            console.error("Erro ao listar atividades:", error);

            throw error;
        }
    }

    /**
     * Busca uma atividade pelo ID.
     * 
     * @param {number} id 
     * @returns {Promise<AtividadeModel|null>}
     */
    async buscarPorId (id) 
    {
        try 
        {
            const sql = 'SELECT * FROM atividade WHERE id = ?';

            const [linhas] = await pool.query(sql, [id]);

            if (linhas.length === 0) return null;

            return this.converterLinhaModel(linhas[0]);

        } 
        catch (error) 
        {
            console.error("Erro ao buscar atividade:", error);

            throw error;
        }
    }

    /**
     * Método auxiliar para converter linha do banco em objeto Model.
     * DRY (Don't Repeat Yorself): Evita repetição de código no findAll e findById.
     * 
     * @param {Object} linha 
     * @returns {AtividadeModel}
     */
    converterLinhaModel (linha)
    {
        return new AtividadeModel(
            linha.id,
            linha.classificacao,
            linha.grupo_empresa,
            linha.grupo_numero,
            linha.mes,
            linha.ano,
            linha.participou,
            linha.horas,
            linha.qtdestudos,
            linha.observacao
        );
    }
}