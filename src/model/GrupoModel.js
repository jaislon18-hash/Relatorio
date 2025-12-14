export class GrupoModel
{
    constructror(empresa, numero, nome)
    {
        this.setEmpresa(empresa);
        this.setNumero(numero);
        this.setNome(nome);
    }

    getEmpresa()
    {
        return this.empresa;
    }

    setEmpresa(empresa)
    {
        if(!empresa)
        {
            throw new Error("O grupo deve estar ligado obrigatoriamente a uma empresa") 
        }

        if(isNaN(empresa))
        {
            throw new Error("o id da empresa deve ser um numero")
        }

        this.empresa = empresa;
    }

    getNumero()
    {
        return this.numero;
    }
    
    setNumero(numero)
    {
        if(numero === null || numero === undefined)
        {
            throw new Error("O numero do grupo é obrigatorio.");
        }

        if(isNaN(numero))
        {
            throw new Error("O numero do grupo deve ser um inteiro.");
        }
        this.numero = numero;
    }

    getNome()
    {
        return this.nome;
    }

    setNome(nome)
    {
        if(!nome || nome.trim() ==="")
        {
            throw new Error("O nome do grupo é obrigatorio.");
        }

        if(nome.length > 45)
        {
            throw new Error("O nome do grupo não pode ter mais de 45 caracteres.");
        }

        this.nome = nome;
    }
}