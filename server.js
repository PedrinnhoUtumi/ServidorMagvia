const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const mqtt = require("mqtt");

const allInsertsController = require("./controller/allInserts.controller");
const todasAsTabelasController = require("./controller/todasAsTabelas.controller");
const myUserController = require("./controller/myUser.controller");

const activePower = require("./entities/activePower");
const voltage = require("./entities/voltage");
const current = require("./entities/current");
const consumption = require("./entities/consumption");
const generation = require("./entities/generation");
const myUser = require("./entities/myUser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

let ultimoDadoMQTT = {}; 

const url = "http://192.168.10.250:5654/db/query";
const mqttUrl = "ws://192.168.10.250:5654/web/api/mqtt";

const mqttOptions = {
  clean: true,
  connectTimeout: 4000,
  protocolVersion: 5,
};

const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

mqttClient.on("connect", () => {
  console.log("Conectado ao broker MQTT");
  mqttClient.subscribe("/api/energia/monitor", (err) => {
    if (!err) {
      console.log("Inscrito no tópico /api/energia/monitor");
    } else {
      console.error("Erro ao se inscrever:", err);
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log("Tópico:", topic);
  console.log("Mensagem recebida:", message.toString());
  if (topic === "/api/energia/monitor") {
    const dados = JSON.parse(message.toString());
    console.log("Dados recebidos:", dados);
    ultimoDadoMQTT = {
      timestamp: new Date().toISOString(),
      ...dados,
    };
    allInsertsController.adicionaTodosOsDados(ultimoDadoMQTT)
  }
});

mqttClient.on("error", (err) => {
  console.error("Erro no MQTT:", err.message);
});



app.get("/", (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="theme-color" content="#FFAA00" />
            <title>API Machbase</title>
        </head>
        <body>
            <h1 style='background-color: #FFAA00;'>Olá Mundo</h1>
        </body>
        </html>
    `);
});

app.get("/api", todasAsTabelasController.listaTodasAsTabelas);

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

  // try {
  //   const maxIdQuery = `SELECT MAX(ID) AS MAX_ID FROM MYUSER`;
  //   const maxIdResponse = await axios.post(
  //     url,
  //     { q: maxIdQuery },
  //     {
  //       auth: {
  //         username: "sys",
  //         password: "manager",
  //       },
  //     }
  //   );
  //   let novoId = 1;
  //   console.log(maxIdResponse.data.data.rows[0][0]);

  //   const resultado = maxIdResponse.data.data.rows[0][0];
  //   if (resultado) {
  //     novoId = resultado + 1;
  //   }

  //   console.log(`Novo ID: ${novoId}`);

  //   const query = `
  //   INSERT INTO MYUSER (ID, NAME, EMAIL, SENHA, ROLE, ACCOUNT)
  //   VALUES ('${novoId}', '${nome}', '${email}', '${senha}', '${role}', '${account}')
  // `;
  //   const response = await axios.post(
  //     url,
  //     { q: query },
  //     {
  //       auth: {
  //         username: "sys",
  //         password: "manager",
  //       },
  //     }
  //   );
  //   res
  //     .status(201)
  //     .json({ message: "Usuário criado com sucesso", response: response.data });
  // } catch (error) {
  //   console.error("Erro ao buscar myuser:", error.message);
  //   res.status(500).json({ error: "Erro ao buscar myuser" });
  // }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});

// SALVANDO COMANDOS
// ngrok config add-authtoken 2wN8FoCzGqhT2tAoannVHp31mFY_p7ZPVxQF9H5EfiwLBSVh
// ngrok http 192.168.10.250:5654