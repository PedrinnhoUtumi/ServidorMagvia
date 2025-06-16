const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

exports.adicionaEquipmentTemperature = async (ultimoDadoMQTT) => {
  const url = "http://192.168.10.250:5654/db/query";
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

    const { tpsd } = ultimoDadoMQTT;
    if ([tpsd].some((val) => val === undefined || val === null)) {
      console.error("Erro: algum valor de potência ativa está indefinido.");
      return;
    }

    const query = `
      INSERT INTO EQUIPMENTTEMPERATURE (ID, TIME, TPSD)
      VALUES ('${novoId}', '${dataFormatada}', '${tpsd}')
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
    console.error("Erro ao inserir EQUIPMENTTEMPERATURE:", error.message);
    if (error.response) {
      console.error("Detalhes:", error.response.data);
    }
  }
};
