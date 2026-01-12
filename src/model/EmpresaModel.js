export class EmpresaModel 
{
    constructor (id, nome, cidade, estado)
    {
        this.setId(id);
        this.setNome(nome);
        this.setCidade(cidade);
        this.setEstado(estado);
    }

    // Getters e setters
    getId ()
    {
        return this.id;
    }

    setId (id)
    {
        this.id = id ? id : null;
    }

    getNome ()
    {
        return this.nome;
    }

    setNome (nome)
    {
        /**
         * 1 == 1 -> true
         * 1 == "1" -> true
         * 1 === 1 -> true
         * 1 === "1" -> false
         */
        if (!nome || nome.trim() === "")
        {
            throw new Error("O nome da empresa é obrigatório.");
        }

        if (nome.length > 80)
        {
            throw new Error("O nome da empresa não pode ultrapassar 80 caracteres.");
        }

        this.nome = nome;
    }

    getCidade ()
    {
        return this.cidade;
    }

    setCidade (cidade)
    {
        if (!cidade || cidade.trim() === "")
        {
            throw new Error("O nome da cidade é obrigatório.");
        }

        if (cidade.length > 45)
        {
            throw new Error("O nome da cidade não pode ultrapassar 45 caracteres.");
        }

        this.cidade = cidade;
    }

    getEstado ()
    {
        return this.estado;
    }

    setEstado (estado)
    {
        if (!estado || estado.trim() === "")
        {
            throw new Error("O nome do estado é obrigatório.");
        }

        if (estado.length > 45)
        {
            throw new Error("O nome do estado não pode ultrapassar 45 caracteres.");
        }

        this.estado = estado;
    }
}