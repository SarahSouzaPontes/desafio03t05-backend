const express = require('express');
const dindin = require('../controladores/dindin');
const rotas = express();

rotas.post('/usuario', dindin.cadastrarUsuario);
rotas.post('/login', dindin.fazerLogin);
rotas.put('/usuario', dindin.atualizarUsuario);
rotas.get('/usuario', dindin.detalharPerfilDoUsuarioLogado);
rotas.get('/categoria', dindin.listarCategorias);
rotas.get('/transacao', dindin.listarTransacao);
rotas.get('/transacao/extrato', dindin.obterExtratoDeTransacoes);
rotas.get('/transacao/:id', dindin.detalharTransacao);
rotas.post('/transacao', dindin.cadastrarTransacao);
rotas.put('/transacao/:id', dindin.atualizarTransacao);
rotas.delete('/transacao/:id', dindin.removerTransacao);


module.exports = rotas;


