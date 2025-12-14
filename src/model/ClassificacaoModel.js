export class CLasificacaoModel{

    constructor(id, nome)
    {
        this.id = id;
        this.setNome(nome);
    }
    getNome()
    {
        return this.nome;
    }
    setNome(nome)
    {
        this.nome = nome;
    }

    getId()
    {
        return this.id;
    }
    setId(id)
    {
        this.id = id ? this.id : null;
    }
}
