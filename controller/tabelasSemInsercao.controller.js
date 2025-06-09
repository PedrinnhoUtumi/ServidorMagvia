const tabelasSemInsercaoDAO = require('../model/dao/tabelasSemInsercao.dao');

exports.listaTodasAsTabelas = async (req, res) => {
    try {
        return await tabelasSemInsercaoDAO.listaTodasAsTabelas();
    } catch (error) {
        console.error("Erro ao obter dados das tabelas:", error);
    }
}
