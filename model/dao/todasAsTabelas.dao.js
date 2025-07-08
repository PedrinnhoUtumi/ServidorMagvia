const axios = require("axios");
const url = "http://192.168.3.8:5654/db/query";
// const url = "http://192.168.10.250:5654/db/query";

exports.listaTodasAsTabelas = async (inicio, fim) => {
  const tabelas = [
    "ACTIVEPOWER",
    "VOLTAGE",
    "CURRENT",
    "CONSUMPTION",
    "GENERATION",
    "ANGLEBETWEENVOLTAGES",
    "ANGLEVOLTAGECURRENT",
    "APPARENTPOWER",
    "EQUIPMENTTEMPERATURE",
    "FREQUENCY",
    "POWERFACTOR",
    "REACTIVEPOWER",
  ];

  let resultados = [];

  try {
    resultados = await Promise.all(
      tabelas.map(async (tabela) => {
        const query = {
          q: `SELECT * FROM ${tabela} WHERE TIME BETWEEN '${inicio}' AND '${fim}' ORDER BY TIME DESC`,
          format: "json",
          timeformat: "default",
          tz: "local",
          precision: 2,
        };

        try {
          const response = await axios.post(url, query, {
            auth: {
              username: "sys",
              password: "manager",
            },
          });
          return response;
        } catch (err) {
          console.error(`❌ Erro ao consultar a tabela ${tabela}:`, err.message);
          return null;
        }
      })
    );
  } catch (err) {
    console.error("❌ Erro inesperado durante Promise.all:", err.message);
    return {};
  }

  const dados = {};
  tabelas.forEach((tabela, index) => {
    const resultado = resultados[index];
    if (resultado && resultado.data) {
      dados[tabela] = resultado.data;
    } else {
      dados[tabela] = { data: { columns: [], rows: [] } }; 
    }
  });

  return dados;
};
