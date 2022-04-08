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
const { format } = require('date-fns');
let bancofinanceiro = require('../bancofinanceiro');

const cadastrarUsuario = (req, res) => {
}
const fazerLogin = (req, res) => {
}
const atualizarUsuario = (req, res) => {
}
const detalharPerfilDoUsuarioLogado = (req, res) => {
}
const listarCategorias = (req, res) => {
}
const listarTransações = (req, res) => {
}
const detalharTransacao = (req, res) => {
}
const cadastrarTransacaoDoUsuarioLogado = (req, res) => {
}
const atualizarTransaçãoDoUsuarioLogado = (req, res) => {
}
const editarTransacao = (req, res) => {
}
const removerTransacao = (req, res) => {
}
const obterExtratoDeTransacoes = (req, res) => {
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