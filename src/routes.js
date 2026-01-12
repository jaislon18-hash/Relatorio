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

// ROTAS DE EMPRESA
router.get('/empresas', (req, res) => empresaController.listar(req, res));
router.get('/empresas/:id', (req, res) => empresaController.buscarPorId(req, res));
router.post('/empresas', (req, res) => empresaController.criar(req, res));
router.put('/empresas/:id', (req, res) => empresaController.atualizar(req, res));
router.delete('/empresas/:id', (req, res) => empresaController.apagar(req, res));

// ROTAS DE CLASSIFICAÇÃO
router.get('/classificacoes', (req, res) => classificacaoController.listar(req, res));
router.get('/classificacoes/:id', (req, res) => classificacaoController.buscarPorId(req, res));
router.post('/classificacoes', (req, res) => classificacaoController.criar(req, res));
router.put('/classificacoes/:id', (req, res) => classificacaoController.atualizar(req, res));
router.delete('/classificacoes/:id', (req, res) => classificacaoController.apagar(req, res));

// ROTAS DE GRUPO
router.get('/grupos', (req, res) => grupoController.listar(req, res));
router.get('/grupos/empresa/:idEmpresa', (req, res) => grupoController.listarPorEmpresa(req, res));
router.get('/grupos/:idEmpresa/:numero', (req, res) => grupoController.buscarPorChave(req, res));
router.post('/grupos', (req, res) => grupoController.criar(req, res));
router.put('/grupos/:idEmpresa/:numero', (req, res) => grupoController.atualizar(req, res));
router.delete('/grupos/:idEmpresa/:numero', (req, res) => grupoController.apagar(req, res));

// ROTAS DE USUÁRIO
router.post('/login', (req, res) => usuarioController.login(req, res)); 
router.get('/usuarios', (req, res) => usuarioController.listar(req, res));
router.get('/usuarios/:cpf', (req, res) => usuarioController.buscarPorCpf(req, res));
router.post('/usuarios', (req, res) => usuarioController.criar(req, res));
router.put('/usuarios/:cpf', (req, res) => usuarioController.atualizar(req, res));
router.delete('/usuarios/:cpf', (req, res) => usuarioController.apagar(req, res));

// ROTAS DE ATIVIDADE
router.get('/atividades', (req, res) => atividadeController.listar(req, res));
router.get('/atividades/:id', (req, res) => atividadeController.buscarPorId(req, res));
router.post('/atividades', (req, res) => atividadeController.criar(req, res));
router.put('/atividades/:id', (req, res) => atividadeController.atualizar(req, res));
router.delete('/atividades/:id', (req, res) => atividadeController.apagar(req, res));

export { router };