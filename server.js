const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 1883;

app.use(cors());
app.use(express.json());
const urlMQTT = "mqtt://192.168.10.250:5653";
const url = "https://537c-177-125-212-179.ngrok-free.app /db/query";

app.get("/", (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="theme-color" content="#FFAA00" />
            <title>Informações do ISBN</title>
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
          q: `SELECT * FROM ${tabela}`,
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
    console.error("Erro ao buscar múltiplas tabelas:", error.message);
    res.status(500).json({ error: "Erro ao buscar múltiplas tabelas" });
  }
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
    console.log(maxIdResponse.data.data.rows[0][0]);
    
    const resultado = maxIdResponse.data.data.rows[0][0];
    if (resultado) {
      novoId = resultado + 1;
    }

    console.log(`Novo ID: ${novoId}`);
    
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
    res
      .status(201)
      .json({ message: "Usuário criado com sucesso", response: response.data });
  } catch (error) {
    console.error("Erro ao buscar múltiplas tabelas:", error.message);
    res.status(500).json({ error: "Erro ao buscar múltiplas tabelas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});

// SALVANDO COMANDOS
// ngrok config add-authtoken 2wN8FoCzGqhT2tAoannVHp31mFY_p7ZPVxQF9H5EfiwLBSVh
// ngrok http 192.168.10.250:5654
