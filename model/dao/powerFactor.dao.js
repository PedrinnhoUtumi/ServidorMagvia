const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

exports.adicionaPowerFactor = async (ultimoDadoMQTT) => {
  // const url = "http://192.168.3.83:5654/db/query";
  // const url = "http://192.168.3.8:5654/db/query";
  const url = process.env.URL;
  function getDataFormatoMachbase() {
    const agora = new Date();

    const horaBrasilia = new Date(agora.getTime() - 60000);

    const ano = horaBrasilia.getFullYear();
    const mes = String(horaBrasilia.getMonth() + 1).padStart(2, '0');
    const dia = String(horaBrasilia.getDate()).padStart(2, '0');
    const hora = String(horaBrasilia.getHours()).padStart(2, '0');
    const minuto = String(horaBrasilia.getMinutes()).padStart(2, '0');
    const segundo = String(horaBrasilia.getSeconds()).padStart(2, '0');
    const hoje = `${ano}-${mes}-${dia} ${hora}:${parseInt(minuto) + 1}:${segundo}`;

    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
  }

  try {
    let novoId = uuidv4();
    const dataFormatada = getDataFormatoMachbase();

    const { pfa, pfb, pfc, pft } = ultimoDadoMQTT;
    if ([pfa, pfb, pfc, pft].some((val) => val === undefined || val === null)) {
      console.error("Erro: algum valor de potência ativa está indefinido.");
      return;
    }

    const query = `
      INSERT INTO POWERFACTOR (ID, TIME, PHASEA, PHASEB, PHASEC, PHASET)
      VALUES ('${novoId}', '${dataFormatada}', '${pfa}', '${pfb}', '${pfc}', '${pft}')
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
    console.error("Erro ao inserir POWERFACTOR:", error.message);
    if (error.response) {
      console.error("Detalhes:", error.response.data);
    }
  }
};