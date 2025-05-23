

async function buscaMachbase(params)  {
      const tabelas = [
        "ACTIVEPOWER",
        "VOLTAGE",
        "CURRENT",
        "BUSINESS",
        "CONSUMPTION",
        "GENERATED",
        "MYUSER",
        "USER_BUSINESS",
      ];
    
      try {
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
    
        res.json({ message: dados });
      } catch (error) {
        console.error("Erro ao buscar múltiplas tabelas:", error.message);
        res.status(500).json({ error: "Erro ao buscar múltiplas tabelas" });
      }
};
    

