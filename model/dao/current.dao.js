const axios = require("axios");

exports.adicionaCurrent = async (ultimoDadoMQTT) => {
  const url = "http://192.168.10.250:5654/db/query";

  try {
    const maxIdQuery = `SELECT MAX(ID) AS MAX_ID FROM CURRENT`;
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

    const { iarms, ibrms, icrms } = ultimoDadoMQTT;
    if ([iarms, ibrms, icrms].some((val) => val === undefined || val === null)) {
      console.error("Erro: algum valor de tensão está indefinido.");
      return;
    }

    const query = `
      INSERT INTO CURRENT (ID, TIME, PHASEA, PHASEB, PHASEC)
      VALUES ('${novoId}', '${dataFormatada}', '${iarms}', '${ibrms}', '${icrms}')
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
    console.error("Erro ao inserir CURRENT:", error.message);
    if (error.response) {
      console.error("Detalhes:", error.response.data);
    }
  }
};
