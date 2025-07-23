const axios = require("axios");
// const url = "http://192.168.3.83:5654/db/query";
  // const url = "http://192.168.3.8:5654/db/query";
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

  const inicioDate = new Date(inicio.replace(" ", "T"));
  const fimDate    = new Date(fim   .replace(" ", "T"));
  const msPorDia   = 1000 * 60 * 60 * 24;
  let dias         = Math.ceil(fimDate - inicioDate) / msPorDia;

  const diasParaCalc = Math.min(dias, 60);

  // define step: 1 = sem amostragem, >1 = pula linhas
  let step = 1;
  if (diasParaCalc > 1) {
    // ceil(dias/4)*4: (2–4)=>4, (5–8)=>8, ...
    step = Math.ceil(diasParaCalc / 4) * 4;
  }

  console.log(`Consultando tabelas: ${tabelas.join(", ")} entre ${inicioDate} e ${fimDate}`);
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
  tabelas.forEach((tabela, idx) => {
    const res = resultados[idx];
    if (res && res.data && res.data.data) {
      const tableData = res.data.data;
      if (step > 1) {
        tableData.rows = tableData.rows.filter((_, i) => i % step === 0);
      }
      dados[tabela] = { data: tableData };
    } else {
      dados[tabela] = { data: { columns: [], rows: [] } };
    }
  });


  return dados;
};
