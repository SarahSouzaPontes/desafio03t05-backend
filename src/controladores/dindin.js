/*
-   Cadastrar Usuário  `POST` `/usuario`
-   Fazer Login  `POST` `/login`
-   Detalhar Perfil do Usuário Logado  `GET` `/usuario`
- Atualizar Usuário *** `PUT` `/usuario`
-   Listar categorias `GET` `/categoria`
-   Listar transações  `GET` `/transacao`
-   Detalhar transação `GET` `/transacao/:id`
-   Cadastrar transação  `POST` `/transacao`
- **Atualizar transação do usuário logado `PUT` `/transacao/:id`
-   Editar transação 
-   Remover transação `DELETE` `/transacao/:id`
-   Obter extrato de transações `GET` `/transacao/extrato`
-   Editar Perfil do Usuário Logado  
*/
const segredo = require('../segredo')
const conexao = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome) return res.status(400).json('Nome é obrigatório!');
    if (!email) return res.status(400).json('Email é obrigatório!');
    if (!senha) return res.status(400).json('Senha é obrigatório!');
    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const query = 'insert into usuarios(nome, email,senha) values ($1,$2,$3)';
        const { rowCount } = await conexao.query(query, [nome, email, hashSenha])
        if (!rowCount) return res.status(400).json('Usário não cadastrado!')
        return res.status(201).json('Usuário criado com sucesso!')
    } catch (error) {
        return res.status(500).json(error.message)

    }
}
const fazerLogin = async (req, res) => {
    const { email, senha } = req.body;
    if (!email) return res.status(400).json('Email é obrigatório!');
    if (!senha) return res.status(400).json('Senha é obrigatório!');
    try {
        const query = 'select * from usuarios where email = $1';
        const { rowCount, rows } = await conexao.query(query, [email]);
        if (!rowCount) return res.status(400).json('Email ou Senha incorretos');
        const usuario = rows[0];
        const senhaVerificada = await bcrypt.compare(senha, usuario.senha)
        if (!senhaVerificada) return res.status(400).json('Senha incorretos');
        const token = jwt.sign({
            id: usuario
                .id, name: usuario.nome
        }, segredo, { expiresIn: '1d' })
        return res.status(200).json(token)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}
const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome) return res.status(400).json('Nome é obrigatório!');
    if (!email) return res.status(400).json('Email é obrigatório!');
    if (!senha) return res.status(400).json('Senha é obrigatório!');
    try {

        let query = 'select * from usuarios where email=$1 values ($1)';
        let { rowCount } = await conexao.query(query, [email]);
        if (rowCount) return res.status(400).json('Email já existente!');
        else {

            const hashSenha = await bcrypt.hash(senha, 10);
            query = 'update into usuarios(nome, email,senha) values ($1,$2,$3)';
            rowCount = await conexao.query(query, [nome, email, hashSenha])
            if (!rowCount) return res.status(400).json('Usário não cadastrado!')
            return res.status(201).json('Usuário criado com sucesso!')
        }
    } catch (error) {
        return res.status(500).json(error.message)

    }

}
const detalharPerfilDoUsuarioLogado = async (req, res) => {
}
const listarCategorias = async (req, res) => {
    /* const {senha_banco} = req.query;
 
     if(!senha_banco){
         return res.status(400).json({"mensagem" : "Campo senha é obrigatório."});
     }
     else if(senha_banco!==bancodedados.banco.senha) {
         return res.status(400).json({"mensagem" : "Senha incorreta"});
     }
 
     return res.status(200).json(bancodedados.contas);
     */
}
const listarTransações = async (req, res) => {
    /* const {senha_banco} = req.query;
 
    if(!senha_banco){
        return res.status(400).json({"mensagem" : "Campo senha é obrigatório."});
    }
    else if(senha_banco!==bancodedados.banco.senha) {
        return res.status(400).json({"mensagem" : "Senha incorreta"});
    }
 
    return res.status(200).json(bancodedados.contas);
    */
}
const detalharTransacao = async (req, res) => {
}
const cadastrarTransacaoDoUsuarioLogado = async (req, res) => {
    /* es const { nome, email, senha } = req.body;
    if (!nome) return res.status(400).json('Nome é obrigatório!');
    if (!email) return res.status(400).json('Email é obrigatório!');
    if (!senha) return res.status(400).json('Senha é obrigatório!');
    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const query = 'insert into usuarios(nome, email,senha) values ($1,$2,$3)';
        const { rowCount } = await conexao.query(query, [nome, email, hashSenha])
        if (!rowCount) return res.status(400).json('Usário não cadastrado!')
        return res.status(201).json('Usuário criado com sucesso!')
    } catch (error) {
        return res.status(500).json(error.message)

    }*/
}
const atualizarTransaçãoDoUsuarioLogado = async (req, res) => {
    /*  const { numeroConta } = req.params;
   const { nome,
         cpf,
         data_nascimento,
         telefone,
         email,
         senha } = req.body;
     if (!nome) {
         return res.status(400).json('Mensagem: campo nome obrigatório');
     }
 
     if (!cpf) {
         return res.status(400).json('Mensagem: campo CPF obrigatório');
     }
     */
}
const editarTransacao = async (req, res) => {
}
const removerTransacao = async (req, res) => {
}
const obterExtratoDeTransacoes = async (req, res) => {
}

module.exports = {
    cadastrarUsuario,
    fazerLogin,
    atualizarUsuario,
    detalharPerfilDoUsuarioLogado,
    listarCategorias,
    listarTransações,
    detalharTransacao,
    cadastrarTransacaoDoUsuarioLogado,
    atualizarTransaçãoDoUsuarioLogado,
    editarTransacao,
    removerTransacao,
    obterExtratoDeTransacoes
}