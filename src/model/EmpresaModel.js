export class EmpresaModel
{
    constructor(nome, cidade, estado)
    {
        this.setNome(nome);
        this.setCidade(cidade);
        this.setEstado(estado);
    }

    getNome()
    {
        return this.nome;
    }

    setNome(nome)
    {
            if(!nome || nome.trim() ==="")
        {
            throw new Error("O nome da empresa é obrigatorio.");
        } 

            if (nome.length > 80)
        {
            throw new Error("O nome da empresa nao pode ter mais de 80 caracteres.");
        }
        this.nome = nome;
    }

    getCidade()
    {
        return this.cidade;
    }

    setCidade(cidade)
    {
            if(cidade.length > 45)
        {
            throw new Error("O nome da cidade não pode ter mais de 45 caracteres.");
        } 

            if(!cidade || cidade.trim() ==="")
        {
            throw new Error("O nome da cidade é obrigatorio.");
        }  

        this.cidade = cidade;
    }
    

    getEstado()
    {
        return this.estado;
    }

    setEstado(estado)
    {
            if(estado.length > 45)
        {
            throw new Error("O nome do estado não pode ter mais de 45 caracteres");
        }
            if(!estado || estado.trim() ==="")

        {
            throw new Error("O nome do estado é obrigatorio.");
        } 
        
        this.estado = estado;
    }
}