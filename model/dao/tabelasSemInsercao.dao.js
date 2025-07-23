const axios = require("axios");
// const url = "http://192.168.3.83:5654/db/query";
  // const url = "http://192.168.3.8:5654/db/query";
const url = "http://192.168.10.250:5654/db/query";

exports.listaTodasAsTabelas = async () => {
  const tabelas = [
    "MYUSER", 
    "BUSINESS", 
    "USER_BUSINESS"
  ];

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

  return dados;
};
