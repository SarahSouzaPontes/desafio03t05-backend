const express = require('express');
const rotas = require('./rotas/rotas');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());
app.use(rotas);

app.listen(8000, () => console.log("Servidor rodando na porta 8000"));