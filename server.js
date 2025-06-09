const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

const todasAsTabelasController = require("./controller/todasAsTabelas.controller");
const myUserController = require("./controller/myUser.controller");
const tabelasSemInsercaoController = require("./controller/tabelasSemInsercao.controller");
const mqttConnection = require("./mqttConnection");

const myUser = require("./entities/myUser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

mqttConnection.conexaoMQTT()

app.get("/", (req, res) => {
  res.send(`Servidor ONLINE! Acesse a API em http://localhost:${PORT}/api`);
});

app.get("/api", async (req, res) => {
  try {
    const [tabelasComInsercao, tabelasSemInsercao] = await Promise.all([
      todasAsTabelasController.listaTodasAsTabelas(),
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

app.post("/api/MYUSER", async (req, res) => {
  const { nome, email, senha, role, account } = req.body;
  const novoUsuario = new myUser(nome, email, senha, role, account);
  try {
    const resultado = await myUserController.adicionaUser(novoUsuario);
    res.status(201).json({ message: resultado });
  } catch (error) {
    console.error("Erro ao adicionar usuário:", error.message);
    res.status(500).json({ error: "Erro ao adicionar usuário" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});