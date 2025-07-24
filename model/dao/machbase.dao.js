const axios = require('axios');

const url = process.env.URL;
const auth = {
  username: "sys",
  password: "manager"
};

exports.buscarUltimosDoisPorTabela = async () => {
  const tabelas = ['insercao', 'semInsercao']; // ajuste conforme suas tabelas reais
  const resultado = {};

  try {
    for (const tabela of tabelas) {
      const query = `
        SELECT *
        FROM ${tabela}
        ORDER BY time DESC
        LIMIT 2
      `;

      const response = await axios.post(
        url,
        { q: query },
        { auth }
      );

      const linhas = response.data?.data?.data || [];
      const colunas = response.data?.data?.column || [];

      resultado[tabela] = {
        data: {
          columns: colunas,
          rows: linhas
        }
      };
    }

    return resultado;
  } catch (error) {
    console.error("❌ Erro ao buscar últimos dados:", error.message);
    if (error.response) {
      console.error("Detalhes:", error.response.data);
    }
    throw error;
  }
};
