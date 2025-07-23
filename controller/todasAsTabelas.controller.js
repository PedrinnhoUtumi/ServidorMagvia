const todasAsTabelasDAO = require('../model/dao/todasAsTabelas.dao');

exports.listaTodasAsTabelas = async (inicio, fim) => {
    try {
        return await todasAsTabelasDAO.listaTodasAsTabelas(inicio, fim);
        console.log(">>> dados retornados pelo service:", JSON.stringify(dados, null, 2));
    } catch (error) {
        console.error("Erro ao obter dados das tabelas:", error);
        throw error;
    }
}
