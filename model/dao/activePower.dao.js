const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

exports.adicionaActivePower = async (ultimoDadoMQTT) => {
  const url = process.env.URL;
  // const url = "http://192.168.3.83:5654/db/query";
  // const url = "http://192.168.3.8:5654/db/query";
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


// const Dados recebidos: {
//   id: '1',

// Potencia ativa
//   pa: '57.01',
//   pb: '5.82',
//   pc: '48.89',
//   pt: '111.88',

// // Potencia reativa
// //   qa: '-12.72',
// //   qb: '-31.26',
// //   qc: '-67.43',
// //   qt: '-111.27',

// // Potencia aparente
// //   sa: '58.24',
// //   sb: '31.57',
// //   sc: '83.22',
// //   st: '157.56',

// Tensões
//   uarms: '127.50',
//   ubrms: '127.52',
//   ucrms: '127.40',

// Correntes
//   iarms: '0.46',
//   ibrms: '0.28',
//   icrms: '0.64',
//   itrms: '0.00',

// // Fator de potencia
// //   pfa: '0.97',
// //   pfb: '0.18',
// //   pfc: '0.58',
// //   pft: '0.71',

// // Angulo entre tensao e corrente
// //   pga: '-90.00',
// //   pgb: '-89.98',
// //   pgc: '-90.00',

// // Frequência
// //   freq: '60.00',

// Consumo
//   epa_c: '2841.11',
//   epb_c: '2398.63',
//   epc_c: '2739.79',
//   ept_c: '8139.02',

// Geração
//   epa_g: '0.00',
//   epb_g: '0.03',
//   epc_g: '0.33',
//   ept_g: '0.00',

// // Angulo entre tensoes
// //   yuaub: '120.13',
// //   yuauc: '239.97',
// //   yubuc: '119.55',

// // Temperatura do equipamento
// //   tpsd: '25.00'
// // }