import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { router } from './routes.js';

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Configuração da View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Necessário para ler dados do formulário

// Middleware Customizado para Method Override
// Permite usar ?method=PUT ou ?method=DELETE na URL de action dos formulários
app.use((req, res, next) => {
    if (req.query && req.query.method) {
        req.method = req.query.method.toUpperCase();
    }
    next();
});

// Arquivos Estáticos (tema da próxima aula)
//app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use(router);

const PORT = process.env.WEB_PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}.`);
  console.log(`📡 Acesse: http://localhost:${PORT}/`);
});