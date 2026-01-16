import { Router } from 'express';

// Importando os Controllers
import { EmpresaController } from './controller/EmpresaController.js';
import { ClassificacaoController } from './controller/ClassificacaoController.js';
import { GrupoController } from './controller/GrupoController.js';
import { UsuarioController } from './controller/UsuarioController.js';
import { AtividadeController } from './controller/AtividadeController.js';

const router = Router();

// Instanciando os Controllers
const empresaController = new EmpresaController();
const classificacaoController = new ClassificacaoController();
const grupoController = new GrupoController();
const usuarioController = new UsuarioController();
const atividadeController = new AtividadeController();

// --- ROTA RAIZ E LOGIN ---
router.get('/', (req, res) => res.redirect('/login')); // Redireciona raiz para login
router.get('/login', (req, res) => usuarioController.formLogin(req, res));
router.post('/login', (req, res) => usuarioController.login(req, res));

// --- ROTAS DE ATIVIDADE ---
router.get('/atividades/novo', (req, res) => atividadeController.formCriar(req, res));
router.get('/atividades/editar/:id', (req, res) => atividadeController.formEditar(req, res));
router.get('/atividades', (req, res) => atividadeController.listar(req, res));
router.post('/atividades', (req, res) => atividadeController.criar(req, res));
router.put('/atividades/:id', (req, res) => atividadeController.atualizar(req, res));
router.delete('/atividades/:id', (req, res) => atividadeController.apagar(req, res));

// --- ROTAS DE CLASSIFICAÇÃO ---
router.get('/classificacoes/novo', (req, res) => classificacaoController.formCriar(req, res));
router.get('/classificacoes/editar/:id', (req, res) => classificacaoController.formEditar(req, res));
router.get('/classificacoes', (req, res) => classificacaoController.listar(req, res));
router.post('/classificacoes', (req, res) => classificacaoController.criar(req, res));
router.put('/classificacoes/:id', (req, res) => classificacaoController.atualizar(req, res));
router.delete('/classificacoes/:id', (req, res) => classificacaoController.apagar(req, res));

// --- ROTAS DE EMPRESA ---
router.get('/empresas/novo', (req, res) => empresaController.formCriar(req, res));
router.get('/empresas/editar/:id', (req, res) => empresaController.formEditar(req, res));
router.get('/empresas', (req, res) => empresaController.listar(req, res));
router.post('/empresas', (req, res) => empresaController.criar(req, res));
router.put('/empresas/:id', (req, res) => empresaController.atualizar(req, res));
router.delete('/empresas/:id', (req, res) => empresaController.apagar(req, res));

// --- ROTAS DE GRUPO ---
router.get('/grupos/novo', (req, res) => grupoController.formCriar(req, res));
router.get('/grupos/editar/:idEmpresa/:numero', (req, res) => grupoController.formEditar(req, res));
router.get('/grupos', (req, res) => grupoController.listar(req, res));
router.post('/grupos', (req, res) => grupoController.criar(req, res));
router.put('/grupos/:idEmpresa/:numero', (req, res) => grupoController.atualizar(req, res));
router.delete('/grupos/:idEmpresa/:numero', (req, res) => grupoController.apagar(req, res));

// --- ROTAS DE USUÁRIO ---
router.get('/usuarios', (req, res) => usuarioController.listar(req, res));
router.get('/usuarios/novo', (req, res) => usuarioController.formCriar(req, res));
router.get('/usuarios/editar/:cpf', (req, res) => usuarioController.formEditar(req, res));
router.post('/usuarios', (req, res) => usuarioController.criar(req, res));
router.put('/usuarios/:cpf', (req, res) => usuarioController.atualizar(req, res));
router.delete('/usuarios/:cpf', (req, res) => usuarioController.apagar(req, res));

export { router };