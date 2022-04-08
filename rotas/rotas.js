const express = require('express');
const cubosbank = require('./controladores/cubosbank');
const rotas = express();
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
rotas.post('/usuario', dindin.cadastrarUsuario);
rotas.post('/login', dindin.fazerLogin);
rotas.put('/usuario', dindin.atualizarUsuario);
rotas.get('/usuario', dindin.detalharPerfilDoUsuarioLogado);
rotas.get('/categoria', dindin.listarCategorias);
rotas.get('/transacao', dindin.listarTransações);
rotas.get('/transacao/:id', dindin.detalharTransacao);
rotas.post('`/transacao', dindin.cadastrarTransacaoDoUsuarioLogado);
rotas.put('/transacao/:id', dindin.atualizarTransaçãoDoUsuárioLogado);
rotas.put('/transacao/:id', dindin.editarTransacao);
rotas.delete('`/transacao/:id', dindin.removerTransacao);
rotas.get('`/transacao/extrato', dindin.obterExtratoDeTransacoes);

module.exports = rotas;


