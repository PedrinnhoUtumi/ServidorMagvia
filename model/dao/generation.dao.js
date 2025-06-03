const axios = require("axios");

exports.adicionaGeneration = async (ultimoDadoMQTT) => {
  const url = "http://192.168.10.250:5654/db/query";

  try {
    const maxIdQuery = `SELECT MAX(ID) AS MAX_ID FROM GENERATION`;
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
    const resultado = maxIdResponse?.data?.data?.rows?.[0]?.[0];

    console.log("Resultado do MAX ID:", resultado);

    if (resultado !== null && resultado !== undefined) {
      novoId = parseInt(resultado) + 1;
    }

    const dataAtual = new Date();
    const dataFormatada = dataAtual
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const { epa_g, epb_g, epc_g, ept_g } = ultimoDadoMQTT;
    if ([epa_g, epb_g, epc_g, ept_g].some((val) => val === undefined || val === null)) {
      console.error("Erro: algum valor de potência ativa está indefinido.");
      return;
    }

    const query = `
      INSERT INTO GENERATION (ID, TIME, TODAY, WEEK, MONTHNOW, LASTMONTH)
      VALUES ('${novoId}', '${dataFormatada}', '${epa_g}', '${epb_g}', '${epc_g}', '${ept_g}')
    `;

    console.log("Query INSERT:", query);

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

    console.log("Resposta INSERT:", response.data);
  } catch (error) {
    console.error("Erro ao inserir Generation:", error.message);
    if (error.response) {
      console.error("Detalhes:", error.response.data);
    }
  }
};
