export class UsuarioModel
{
    constructor(cpf, nome, email, senha, telefone, admin, empresa)
    {
        this.setCpf(cpf);
        this.setNome(nome);
        this.setEmail(email);
        this.setSenha(senha);
        this.setTelefone(telefone);
        this.setAdmin(admin);
        this.setEmpresa(empresa);

    }

    getCpf()
    {
        return this.cpf;
    }
    setCpf(cpf)
    {
        if(!cpf || cpf.trim() ==="")
        {
            throw new Error("O cpf é obrigatorio.");
        }

        const cpfLimpo = cpf.replace(/\D/g, '');

        if(cpfLimpo.length > 11)
        {
            throw new Error("O cpf não pode ter mais de 11 caracteres.");
        }
        this.cpf = cpfLimpo;
    }

    getNome()
    {
        return this.nome;
    }

    setNome(nome)
    {
        if(!nome || nome.trim() ==="")
        {
            throw new Error("O nome do usuario é obrigatorio.");
        }
        if(nome.length > 80)
        {
            throw new Error("O nome do usuario não pode ter mais de 80 caracteres.");
        }
        this.nome = nome;

    }

    getEmail()
    {
        return this.email;
    }

    setEmail(email)
    {
        if(!email || email.trim() ==="")
        {
            throw new Error("O email é obrigatorio.");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        {
            throw new Error("O email deve ser valido.");
        }
        if(email.length > 80)
        {
            throw new Error("O email não pode ter mais de 80 caracteres.");
        }
        this.email = email;
    }
    getSenha()
    {
        return this.senha;
    }

    setSenha(senha)
    {
        if(!senha || senha.trim() ==="")
        {
            throw new Error("A senha é obrigatoria.");
        }

        if(senha.length > 32)
        {
            throw new Error("A senha não pode ter mais de 32 caracteres.");
        }
        this.senha = senha;
    }

    getTelefone()
    {
        return this.telefone;
    }
    setTelefone(telefone)
    {
        if(!telefone || telefone.trim() ==="")
        {
            throw new Error("O telefone é obrigatorio.");
        }
        
        const telefoneLimpo = telefone.replace(/\D/g, '');

        if(telefoneLimpo.length > 11)
        {
            throw new Error("O telefone não pode ter mais de 11 caracteres.");
        }
        this.telefone = telefoneLimpo;
    }
    getAdmin()
    {
        return this.admin;
    }

    setAdmin(admin)
    {
        this.admin = (admin === true || admin === 1 || admin === '1') ? 1 : 0;
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

}