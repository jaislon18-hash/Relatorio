export class EmpresaModel
{
    constructor(nome, cidade, estado)
    {
        this.nome = nome;
        this.cidade = cidade;
        this.estado = estado;
    }

    getNome()
    {
        return this.nome;
    }

    setNome(nome)
    {
        this.nome = nome;
    }

    getCidade()
    {
        return this.cidade;
    }

    setCidade(cidade)
    {
        this.cidade = cidade;
    }
    
    getEstado()
    {
        return this.estado;
    }

    setEstado(estado)
    {
        this.estado = estado;
    }
}