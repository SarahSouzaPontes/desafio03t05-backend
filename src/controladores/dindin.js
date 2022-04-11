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
    if (!email) return res.status(400).json({ "mensagem": 'Email é obrigatório!' });
    if (!senha) return res.status(400).json({ "mensagem": 'Senha é obrigatório!' });
    try {
        const query = 'select * from usuarios where email = $1';
        const { rowCount, rows } = await conexao.query(query, [email]);
        if (!rowCount) return res.status(400).json({
            "mensagem": "Usuário e/ou senha inválido(s)."
        });
        const usuario = rows[0];
        const senhaVerificada = await bcrypt.compare(senha, usuario.senha)
        if (!senhaVerificada) return res.status(400).json({ "mensagem": 'Senha incorretos' });
        const token = jwt.sign({
            id: usuario.id,
            name: usuario.nome
        }, segredo, { expiresIn: '1d' })
        return res.status(200).json(token)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}
const atualizarUsuario = async (req, res) => {
    const token = getTokenBearer(req, res)

    if (token) {
        usuario = verificaToken(token);
        if (!usuario) return res.status(400).json({ "mensagem": 'Token Inválido' });

        const { nome, email, senha } = req.body;
        if (!nome) return res.status(400).json({ "mensagem": 'Nome é obrigatório!' });
        if (!email) return res.status(400).json({ "mensagem": 'Email é obrigatório!' });
        if (!senha) return res.status(400).json({ "mensagem": 'Senha é obrigatório!' });

        try {
            let query = 'select * from usuarios where email=$1';
            let { rowCount } = await conexao.query(query, [email]);
            if (rowCount) return res.status(400).json({ "mensagem": "O e-mail informado já está sendo utilizado por outro usuário." });
            else {
                const hashSenha = await bcrypt.hash(senha, 10);
                query = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4';
                rowCount = await conexao.query(query, [nome, email, hashSenha, usuario.id])
                if (!rowCount) return res.status(400).json({ "mensagem": 'Usário não cadastrado!' })
                return res.status(201).json({ "mensagem": 'Usuário atualizado com sucesso!' })
            }
        } catch (error) {
            return res.status(500).json(error.message)
        }

    } else {
        return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }
}
const detalharPerfilDoUsuarioLogado = async (req, res) => {
    const token = getTokenBearer(req, res)
    usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    query = "select id, nome, email from usuarios where id = $1"
    try {
        rowCount = await conexao.query(query, [usuario.id])
        return res.status(200).json(rowCount.rows[0])
    } catch (error) {
        return res.status(500).json(error.message)
    }

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

function getTokenBearer(req, res) {
    const bearerheader = req.headers['authorization'];
    if (typeof bearerheader !== 'undefined') {

        const bearer = bearerheader.split(' ')
        const bearerToken = bearer[1]
        return bearerToken
    }
    else {
        return null
    }
}
function verificaToken(token) {

    try {
        usuario = jwt.verify(token, segredo);
        return usuario
    }
    catch (error) {
        return null
    }


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