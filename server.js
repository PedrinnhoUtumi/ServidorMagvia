const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const todasAsTabelasController = require("./controller/todasAsTabelas.controller");
const myUserController = require("./controller/myUser.controller");
const tabelasSemInsercaoController = require("./controller/tabelasSemInsercao.controller");
const machbaseAdcionaDados = require("./controller/machbase.controller");
const mqttConnection = require("./mqttConnection");
const myUser = require("./entities/myUser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

mqttConnection.ativaConexaoMQTT();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/api", async (req, res) => {  
  const { inicio, fim } = req.query;
  console.log(`Requisição recebida para o intervalo: ${inicio} a ${fim}`);
  console.log(`Requisição recebida para /api/:${encodeURIComponent(inicio)}/:${encodeURIComponent(fim)}`);
  
  if (!inicio || !fim || isNaN(new Date(inicio)) || isNaN(new Date(fim))) {
    return res.status(400).json({error: `Parâmetros inválidos para Machbase: inicio=${inicio}, fim=${fim}`})
  }
  try {
    const [tabelasComInsercao, tabelasSemInsercao] = await Promise.all([
      todasAsTabelasController.listaTodasAsTabelas(inicio, fim),
      tabelasSemInsercaoController.listaTodasAsTabelas(),
    ]);
    res.status(200).json({
      insercao: tabelasComInsercao,
      semInsercao: tabelasSemInsercao,
    });
  } catch (error) {
    console.error("Erro ao obter dados:", error);
    res.status(500).json({ error: "Erro ao obter dados das tabelas" });
  }
});

app.post("/api/MYUSER", myUserController.criarUsuario);

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/api/login", myUserController.loginUser);

app.put("/api/MYUSER/:id", async (req, res) => {
  const { nome, email, role, account } = req.body;
  const { id } = req.params;
  const senha = null
  const novoUsuario = new myUser(nome, email, senha, role, account);
  try {
    const resultado = await myUserController.alteraUser(novoUsuario, id);
    res.status(201).json({ message: resultado });
  } catch (error) {
    console.error("Erro ao adicionar usuário:", error.message);
    res.status(500).json({ error: error });
  }
});

app.get('/api/ultimos', async (req, res) => {
  const dados = await machbaseAdcionaDados(); 
  res.json(dados);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Node.js rodando em http://localhost:${PORT}`)
});