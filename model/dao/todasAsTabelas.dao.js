const axios = require("axios");
const url = "http://192.168.10.250:5654/db/query";

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
  function getDia() {
    const agora = new Date();

    const horaBrasilia = new Date(agora.getTime() - 60000);

    const ano = horaBrasilia.getFullYear();
    const mes = String(horaBrasilia.getMonth() + 1).padStart(2, '0');
    const dia = String(horaBrasilia.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }
  const diaAtual = getDia();

  const resultados = await Promise.all(
    tabelas.map((tabela) => {
      const query = {
        q: `SELECT * FROM ${tabela} WHERE TIME BETWEEN '${inicio}' AND '${fim}' ORDER BY TIME DESC`,
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

  return dados;
};
