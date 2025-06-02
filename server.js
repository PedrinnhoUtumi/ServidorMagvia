// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const bodyParser = require("body-parser");
// const app = express();
// const PORT = process.env.PORT || 1883;
// const mqtt = require("mqtt");
// const activePowerController = require("./controller/activePower.controller");
// const voltageController = require("./controller/voltage.controller");
// const activePower = require("./entities/activePower");
// const voltage = require("./entities/voltage");

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(cors());
// app.use(express.json());

// let ultimoDadoMQTT = {}; 

// const url = "http://192.168.10.250:5654/db/query";
// const mqttUrl = "ws://192.168.10.250:5654/web/api/mqtt";
// // const mqttUrl = "ws://serveo.net:5654/web/api/mqtt";

// const mqttOptions = {
//   clean: true,
//   connectTimeout: 4000,
//   protocolVersion: 5,
// };

// const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

// mqttClient.on("connect", () => {
//   console.log("Conectado ao broker MQTT");
//   mqttClient.subscribe("/api/energia/monitor", (err) => {
//     if (!err) {
//       console.log("Inscrito no tópico /api/energia/monitor");
//     } else {
//       console.error("Erro ao se inscrever:", err);
//     }
//   });
// });

// mqttClient.on("message", (topic, message) => {
//   console.log("Tópico:", topic);
//   console.log("Mensagem recebida:", message.toString());
//   if (topic === "/api/energia/monitor") {
//     const dados = JSON.parse(message.toString());
//     console.log("Dados recebidos:", dados);
//     ultimoDadoMQTT = {
//       timestamp: new Date().toISOString(),
//       ...dados,
//     };

//     voltageController.adicionaVoltage(ultimoDadoMQTT)
//       .then(() => {
//         console.log("Dados de tensão salvos com sucesso no banco de dados.");
//       })
//       .catch((error) => {
//         console.error("Erro ao salvar dados de tensão no banco de dados:", error);
//       })

//     activePowerController.adicionaActivePower(ultimoDadoMQTT)
//       .then(() => {
//         console.log("Dados salvos com sucesso no banco de dados.");
//       })
//       .catch((error) => {
//         console.error("Erro ao salvar dados no banco de dados:", error);
//       });

//   }
// });

// mqttClient.on("error", (err) => {
//   console.error("Erro no MQTT:", err.message);
// });



// app.get("/", (req, res) => {
//   res.send(`
//         <!DOCTYPE html>
//         <html lang="pt-BR">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <meta name="theme-color" content="#FFAA00" />
//             <title>API Machbase</title>
//         </head>
//         <body>
//             <h1 style='background-color: #FFAA00;'>Olá Mundo</h1>
//         </body>
//         </html>
//     `);
// });

// app.get("/api", async (req, res) => {
//   const tabelas = [
//     "ACTIVEPOWER",
//     "VOLTAGE",
//     "CURRENT",
//     "BUSINESS",
//     "CONSUMPTION",
//     "GENERATED",
//     "MYUSER",
//     "USER_BUSINESS",
//   ];

//   try {
//     const resultados = await Promise.all(
//       tabelas.map((tabela) => {
//         const query = {
//           q: `SELECT * FROM ${tabela} ORDER BY ID`,
//           format: "json",
//           timeformat: "default",
//           tz: "local",
//           precision: 2,
//         };

//         return axios.post(url, query, {
//           auth: {
//             username: "sys",
//             password: "manager",
//           },
//         });
//       })
//     );
//     console.log("Resultados obtidos:", resultados);
    

//     const dados = {};
//     tabelas.forEach((tabela, index) => {
//       dados[tabela] = resultados[index].data;
//     });

//     res.json({ message: dados });
//   } catch (error) {
//     console.error("Erro ao buscar múltiplas tabelas:", error.message.status);
//     res.status(500).json({ error: "Erro ao buscar múltiplas tabelas" });
//   }
// });

// app.get("/monitor", (req, res) => {
//   console.log(ultimoDadoMQTT);
//   if (Object.keys(ultimoDadoMQTT).length === 0) {
    
//     return res.send("ERRO");
//   }

//   const dados = {
//     potenciaAtiva: {
//       pa: parseFloat(ultimoDadoMQTT.pa),
//       pb: parseFloat(ultimoDadoMQTT.pb),
//       pc: parseFloat(ultimoDadoMQTT.pc),
//       pt: parseFloat(ultimoDadoMQTT.pt),
//     },
//     potenciaReativa: {
//       qa: parseFloat(ultimoDadoMQTT.qa),
//       qb: parseFloat(ultimoDadoMQTT.qb),
//       qc: parseFloat(ultimoDadoMQTT.qc),
//       qt: parseFloat(ultimoDadoMQTT.qt),
//     },
//     tensoes: {
//       uarms: parseFloat(ultimoDadoMQTT.uarms),
//       ubrms: parseFloat(ultimoDadoMQTT.ubrms),
//       ucrms: parseFloat(ultimoDadoMQTT.ucrms),
//     },
//     correntes: {
//       iarms: parseFloat(ultimoDadoMQTT.iarms),
//       ibrms: parseFloat(ultimoDadoMQTT.ibrms),
//       icrms: parseFloat(ultimoDadoMQTT.icrms),
//       itrms: parseFloat(ultimoDadoMQTT.itrms),
//     },
//     fatorPotencia: {
//       pfa: parseFloat(ultimoDadoMQTT.pfa),
//       pfb: parseFloat(ultimoDadoMQTT.pfb),
//       pfc: parseFloat(ultimoDadoMQTT.pfc),
//       pft: parseFloat(ultimoDadoMQTT.pft),
//     },
//     frequencia: {
//       freq: parseFloat(ultimoDadoMQTT.freq),
//     },
//     timestamp: ultimoDadoMQTT.timestamp
//   };

//   res.json({ message: dados });
// });

// app.post("/api/MYUSER", async (req, res) => {
//   const { nome, email, senha, role, account } = req.body;

//   try {
//     const maxIdQuery = `SELECT MAX(ID) AS MAX_ID FROM MYUSER`;
//     const maxIdResponse = await axios.post(
//       url,
//       { q: maxIdQuery },
//       {
//         auth: {
//           username: "sys",
//           password: "manager",
//         },
//       }
//     );
//     let novoId = 1;
//     console.log(maxIdResponse.data.data.rows[0][0]);

//     const resultado = maxIdResponse.data.data.rows[0][0];
//     if (resultado) {
//       novoId = resultado + 1;
//     }

//     console.log(`Novo ID: ${novoId}`);

//     const query = `
//     INSERT INTO MYUSER (ID, NAME, EMAIL, SENHA, ROLE, ACCOUNT)
//     VALUES ('${novoId}', '${nome}', '${email}', '${senha}', '${role}', '${account}')
//   `;
//     const response = await axios.post(
//       url,
//       { q: query },
//       {
//         auth: {
//           username: "sys",
//           password: "manager",
//         },
//       }
//     );
//     res
//       .status(201)
//       .json({ message: "Usuário criado com sucesso", response: response.data });
//   } catch (error) {
//     console.error("Erro ao buscar myuser:", error.message);
//     res.status(500).json({ error: "Erro ao buscar myuser" });
//   }
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Servidor Node.js rodando na porta ${PORT}`);
// });

// // SALVANDO COMANDOS
// // ngrok config add-authtoken 2wN8FoCzGqhT2tAoannVHp31mFY_p7ZPVxQF9H5EfiwLBSVh
// // ngrok http 192.168.10.250:5654


const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Porta HTTP correta!

// Controllers e entidades
const activePowerController = require("./controller/activePower.controller");
const voltageController = require("./controller/voltage.controller");

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Último dado MQTT recebido
let ultimoDadoMQTT = {};

// URL do banco Machbase e do broker MQTT via WebSocket
const url = "http://192.168.10.250:5654/db/query";
const mqttUrl = "ws://192.168.10.250:5654/web/api/mqtt";

const mqttOptions = {
  clean: true,
  connectTimeout: 4000,
  protocolVersion: 5,
};

// ✅ Conexão ao broker MQTT
const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

mqttClient.on("connect", () => {
  console.log("🔌 Conectado ao broker MQTT");
  mqttClient.subscribe("/api/energia/monitor", (err) => {
    if (!err) {
      console.log("📡 Inscrito no tópico /api/energia/monitor");
    } else {
      console.error("❌ Erro ao se inscrever:", err);
    }
  });
});

mqttClient.on("message", (topic, message) => {
  if (topic === "/api/energia/monitor") {
    const dados = JSON.parse(message.toString());
    ultimoDadoMQTT = {
      timestamp: new Date().toISOString(),
      ...dados,
    };

    voltageController.adicionaVoltage(ultimoDadoMQTT)
      .then(() => console.log("⚡ Dados de tensão salvos"))
      .catch((err) => console.error("❌ Erro tensão:", err));

    activePowerController.adicionaActivePower(ultimoDadoMQTT)
      .then(() => console.log("🔋 Dados de potência ativa salvos"))
      .catch((err) => console.error("❌ Erro potência:", err));
  }
});

mqttClient.on("error", (err) => {
  console.error("❌ Erro no MQTT:", err.message);
});

// === ROTAS EXPRESS ===

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>API Machbase</title>
    </head>
    <body>
        <h1 style='background-color: #FFAA00;'>Olá Mundo</h1>
    </body>
    </html>
  `);
});

app.get("/api", async (req, res) => {
  const tabelas = [
    "ACTIVEPOWER",
    "VOLTAGE",
    "CURRENT",
    "BUSINESS",
    "CONSUMPTION",
    "GENERATED",
    "MYUSER",
    "USER_BUSINESS",
  ];

  try {
    const resultados = await Promise.all(
      tabelas.map((tabela) => {
        const query = {
          q: `SELECT * FROM ${tabela} ORDER BY ID`,
          format: "json",
          timeformat: "default",
          tz: "local",
          precision: 2,
        };
        return axios.post(url, query, {
          auth: {
            username: "sys",
            password: "manager",
          },
        });
      })
    );

    const dados = {};
    tabelas.forEach((tabela, index) => {
      dados[tabela] = resultados[index].data;
    });

    res.json({ message: dados });
  } catch (error) {
    console.error("❌ Erro ao buscar múltiplas tabelas:", error.message);
    res.status(500).json({ error: "Erro ao buscar múltiplas tabelas" });
  }
});

app.get("/monitor", (req, res) => {
  if (Object.keys(ultimoDadoMQTT).length === 0) {
    return res.status(404).send("ERRO: Nenhum dado MQTT recebido ainda.");
  }

  const dados = {
    potenciaAtiva: {
      pa: parseFloat(ultimoDadoMQTT.pa),
      pb: parseFloat(ultimoDadoMQTT.pb),
      pc: parseFloat(ultimoDadoMQTT.pc),
      pt: parseFloat(ultimoDadoMQTT.pt),
    },
    potenciaReativa: {
      qa: parseFloat(ultimoDadoMQTT.qa),
      qb: parseFloat(ultimoDadoMQTT.qb),
      qc: parseFloat(ultimoDadoMQTT.qc),
      qt: parseFloat(ultimoDadoMQTT.qt),
    },
    tensoes: {
      uarms: parseFloat(ultimoDadoMQTT.uarms),
      ubrms: parseFloat(ultimoDadoMQTT.ubrms),
      ucrms: parseFloat(ultimoDadoMQTT.ucrms),
    },
    correntes: {
      iarms: parseFloat(ultimoDadoMQTT.iarms),
      ibrms: parseFloat(ultimoDadoMQTT.ibrms),
      icrms: parseFloat(ultimoDadoMQTT.icrms),
      itrms: parseFloat(ultimoDadoMQTT.itrms),
    },
    fatorPotencia: {
      pfa: parseFloat(ultimoDadoMQTT.pfa),
      pfb: parseFloat(ultimoDadoMQTT.pfb),
      pfc: parseFloat(ultimoDadoMQTT.pfc),
      pft: parseFloat(ultimoDadoMQTT.pft),
    },
    frequencia: {
      freq: parseFloat(ultimoDadoMQTT.freq),
    },
    timestamp: ultimoDadoMQTT.timestamp,
  };

  res.json({ message: dados });
});

app.post("/api/MYUSER", async (req, res) => {
  const { nome, email, senha, role, account } = req.body;

  try {
    const maxIdQuery = `SELECT MAX(ID) AS MAX_ID FROM MYUSER`;
    const maxIdResponse = await axios.post(
      url,
      { q: maxIdQuery },
      {
        auth: {
          username: "sys",
          password: "manager",
        },
      }
    );

    let novoId = 1;
    const resultado = maxIdResponse.data.data.rows[0][0];
    if (resultado) {
      novoId = resultado + 1;
    }

    const query = `
      INSERT INTO MYUSER (ID, NAME, EMAIL, SENHA, ROLE, ACCOUNT)
      VALUES ('${novoId}', '${nome}', '${email}', '${senha}', '${role}', '${account}')
    `;
    const response = await axios.post(
      url,
      { q: query },
      {
        auth: {
          username: "sys",
          password: "manager",
        },
      }
    );

    res.status(201).json({ message: "Usuário criado com sucesso", response: response.data });
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error.message);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// ✅ Inicia servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});
