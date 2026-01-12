import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes.js';

// Configuração das variáveis de ambiente
dotenv.config();

const app = express();

// Permite que o navegador autorize requisições de outras portas (Ex.: http://localhost:3001).
app.use(cors());

app.use(express.json());

app.use(router);

const PORT = process.env.WEB_PORT || 3000;

app.listen(PORT, () => 
{
  console.log(`\n🚀 Servidor rodando na porta ${PORT}.`); // win + . --> Para abrir janela de emojis
  console.log(`📡 URL base: http://localhost:${PORT}.`);
  console.log(`-----------------------------------------`);
});