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
                return res.status(201).send()
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
    const token = getTokenBearer(req, res)
    usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    query = "select * from categoria "
    try {
        rows = await conexao.query(query)
        return res.status(200).json(rows.rows)
    } catch (error) {
        return res.status(500).json(error.message)

    }
}

const cadastrarTransacao = async (req, res) => {
    const token = getTokenBearer(req, res)
    const usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    const { tipo, descricao, valor, data, categoria_id } = req.body
    if (!tipo) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!descricao) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!valor) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!data) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!categoria_id) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!(tipo === 'entrada' || tipo === 'saida')) return res.status(400).json({ "mensagem": "O tipo deve ser entrada ou saida" })

    try {
        let { rows, rowCount } = await conexao.query('select descricao from categoria where id=$1', [categoria_id])
        if (!rowCount) return res.status(404).json({ "mensagem": "Categoria informada não existe" })
        const categoria_name = rows[0].descricao
        query = "insert into transacao(descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) RETURNING id "
        rows = await conexao.query(query, [descricao, valor, data, categoria_id, usuario.id, tipo]);
        return res.status(200).json({

            "id": rows.rows[0].id,
            "tipo": tipo,
            "descricao": descricao,
            "valor": valor,
            "data": data,
            "usuario_id": usuario.id,
            "categoria_id": categoria_id,
            "categoria_nome": categoria_name,

        })


    } catch (error) {
        return res.status(500).json(error.message)
    }
}
const listarTransacao = async (req, res) => {
    const token = getTokenBearer(req, res)
    const usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    const query = "select * from transacao where usuario_id = $1"
    try {
        let { rows, rowCount } = await conexao.query(query, [usuario.id])
        if (!rowCount) return res.status(404).json({ "mensagem": "Não exitem transações cadastradas" })
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json(error.message)
    }

}
const detalharTransacao = async (req, res) => {
    const token = getTokenBearer(req, res)
    const usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    const { id } = req.params
    const query = "select * from transacao where usuario_id = $1 and id = $2"
    try {
        let { rows, rowCount } = await conexao.query(query, [usuario.id, id])
        if (!rowCount) return res.status(404).json({ "mensagem": "Transação não encontrada." })
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const atualizarTransacao = async (req, res) => {
    const token = getTokenBearer(req, res)
    const usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body

    if (!descricao) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!valor) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!data) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!categoria_id) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!tipo) return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    if (!(tipo === 'entrada' || tipo === 'saida')) return res.status(400).json({ "mensagem": "O tipo deve ser entrada ou saida" })

    const query = "update transacao set \
    descricao =$3, \
    valor = $4, \
    data=$5, \
    categoria_id=$6, \
    tipo=$7 where usuario_id = $1 and id =$2"
    try {
        let { rowCount } = await conexao.query(query, [usuario.id, id, descricao, valor, data, categoria_id, tipo])
        console.log(rowCount)
        if (!rowCount) return res.status(404).json({ "mensagem": "Transação não encontrada." })
        else return res.status(200).send()
    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const removerTransacao = async (req, res) => {
    const token = getTokenBearer(req, res)
    const usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    const { id } = req.params
    const query = "delete from transacao where usuario_id = $1 and id = $2"
    try {
        let { rowCount } = await conexao.query(query, [usuario.id, id])
        if (!rowCount) return res.status(404).json({ "mensagem": "Transação não encontrada." })
        return res.status(200).send()
    } catch (error) {
        return res.status(500).json(error.message)
    }
}
const obterExtratoDeTransacoes = async (req, res) => {
    const token = getTokenBearer(req, res)
    const usuario = verificaToken(token);
    if (!usuario) return res.status(400).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    let _entrada = 0
    let _saida = 0
    const query = "select * from transacao where usuario_id = $1"
    try {
        let { rows, rowCount } = await conexao.query(query, [usuario.id])
        if (!rowCount) return res.status(404).json({ "mensagem": "Não exitem transações cadastradas" })
        rows.forEach(row => {
            if (row.tipo === "entrada") {
                console.log(row.valor)
                _entrada = _entrada + parseInt(row.valor)
            } else {
                _saida = _saida + parseInt(row.valor)
            }

        });
        return res.status(200).json({
            "entrada": _entrada,
            "saida": _saida
        })


    } catch (error) {
        return res.status(500).json(error.message)
    }

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
    listarTransacao,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    removerTransacao,
    obterExtratoDeTransacoes
}