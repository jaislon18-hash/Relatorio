export class AtividadeModel
{
    constructor(id, classificacao, grupoEmpresa, grupoNumero, mes, ano, participou, horas, qtdestudos, observacao)
    {
        this.setId(id);
        this.setClassificacao(classificacao);
        this.setGrupoEmpresa(grupoEmpresa);
        this.setGrupoNumero(grupoNumero);
        this.setMes(mes);
        this.setAno(ano);
        this.setParticipou(participou);
        this.setHoras(horas);
        this.setQtdEstudos(qtdestudos);
        this.setObservacao(observacao);

    }

    getId()
    {
        return this.id;
    }
    setId(id)
    {
        this.id = id ? id : null;
    }

    getClassificacao()
    {
        return this.clasificacao;
    }
    setClassificacao(classificacao)
    {
        if(!classificacao || isNaN(classificacao))
        {
            throw new Error("O id da classificacao é obrigatorio e deve ser um numero.");
        }

        this.classificacao = classificacao;
    }
    getGrupoEmpresa()
    {
        return this.grupoEmpresa;
    }
    setGrupoEmpresa(grupoEmpresa)
    {
        if(!grupoEmpresa || isNaN(grupoEmpresa))
        {
            throw new Error("O ID da empresa é obrigatorio e deve ser um numero.");
        }
        this.grupoEmpresa = grupoEmpresa;

    }

    getGrupoNumero()
    {
        return this.grupoNumero;
    }
    setGrupoNumero(grupoNumero)
    {
        if(!grupoNumero || isNaN(grupoNumero))
        {
            throw new Error("O ID do grupo é obrigatorio e deve ser um numero.");
        }
        this.grupoNumero = grupoNumero;

    }

    getMes()
    {
        return this.mes;
    }
    setMes(mes)
    {
        if(!mes || isNaN(mes) || mes < 1 || mes > 12)
        {
            throw new Error("O mes é obrigatorio e deve ser um numero entre 1 e 12.");
        }
        this.mes = mes;
    }
    getAno()
    {
        return this.ano;
    }
    setAno(ano)
    {
        if(!ano || isNaN(ano))
        {
            throw new Error("O ano é obrigatorio e deve ser um numero.");
        }
        this.ano = ano;
    }
    getParticipou()
    {
        return this.participou;
    }
    setParticipou(participou)
    {
        this.participou = (participou === true || participou === 1 || participou === '1') ? 1 : 0;
    }
    getHoras()
    {
        return this.horas;
    }
    setHoras(horas)
    {
        if(horas === null || horas === undefined || isNaN(horas) || horas < 0)
        {
            throw new Error("As horas devem ser um numero maior ou igual a zero.");
        }
        this.horas = horas;
    }
    getQtdEstudos()
    {
        return this.qtdestudos;
    }
    setQtdEstudos(qtdestudos)
    {
        if(qtdestudos === null || qtdestudos === undefined || isNaN(qtdestudos) || qtdestudos < 0)
        {
            throw new Error("A quantidade de estudos deve ser um numero maior ou igual a zero.");
        }
        this.qtdestudos = qtdestudos;

    }
    getObservacao()
    {
        return this.observacao;

    }
    setObservacao(observacao)
    {
        if(observacao && observacao.length > 150)
        {
            throw new Error("A observação não pode ter mais de 150 caracteres.");
        }
        this.observacao = observacao;
    }



}