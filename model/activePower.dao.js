exports.adicionaActivePower = async  (ultimoDadoMQTT) => {
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
        console.log(maxIdResponse.data.data.rows[0][0]);
    
        const resultado = maxIdResponse.data.data.rows[0][0];
        if (resultado) {
          novoId = resultado + 1;
        }
    
        console.log(`Novo ID: ${novoId}`);
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toISOString().slice(0, 19).replace("T", " ");
        const query = `
        INSERT INTO ACTIVEPOWER (ID, TIME, PHASEA, PHASEB, PHASEC, PHASET)
        VALUES ('${novoId}', '${dataFormatada}','${ultimoDadoMQTT.pa}', '${ultimoDadoMQTT.pb}', '${ultimoDadoMQTT.pc}', '${ultimoDadoMQTT.pt}')
      `;
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
      } catch (error) {
        console.error("Erro ao buscar múltiplas tabelas:", error.message);
        res.status(500).json({ error: "Erro ao buscar múltiplas tabelas" });
      }
}