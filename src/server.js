const api = require('express')();
require('dotenv').config();

const porta = process.env.PORTA_API;

api.listen(porta, () => {
  console.log(`API rodando na porta ${porta}`);
});

api.get('/', (requisicao, resposta) => {
  resposta.send({ mensagem: 'API online!' });
});
