const axios = require("axios");

exports.adicionaActivePower = async (ultimoDadoMQTT) => {
  const url = "http://192.168.10.250:5654/db/query";

  try {
    const maxIdQuery = `SELECT MAX(ID) AS MAX_ID FROM ACTIVEPOWER`;
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

    // Validação básica dos dados
    const { pa, pb, pc, pt } = ultimoDadoMQTT;
    if ([pa, pb, pc, pt].some((val) => val === undefined || val === null)) {
      console.error("Erro: algum valor de potência ativa está indefinido.");
      return;
    }

    const query = `
      INSERT INTO ACTIVEPOWER (ID, TIME, PHASEA, PHASEB, PHASEC, PHASET)
      VALUES ('${novoId}', '${dataFormatada}', '${pa}', '${pb}', '${pc}', '${pt}')
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
    console.error("Erro ao inserir activepower:", error.message);
    if (error.response) {
      console.error("Detalhes:", error.response.data);
    }
  }
};
