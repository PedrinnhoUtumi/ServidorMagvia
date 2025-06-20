const todasAsTabelasDAO = require('../model/dao/todasAsTabelas.dao');

exports.listaTodasAsTabelas = async (inicio, fim) => {
    try {
        return await todasAsTabelasDAO.listaTodasAsTabelas(inicio, fim);
    } catch (error) {
        console.error("Erro ao obter dados das tabelas:", error);
    }
}
