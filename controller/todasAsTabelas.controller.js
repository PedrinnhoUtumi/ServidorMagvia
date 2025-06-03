const todasAsTabelasDAO = require('../model/dao/todasAsTabelas.dao');

exports.listaTodasAsTabelas = async (req, res) => {
    try {
        const dados = await todasAsTabelasDAO.listaTodasAsTabelas();
        res.status(200).json({message: dados});
    } catch (error) {
        console.error("Erro ao obter dados das tabelas:", error);
        res.status(500).json({ error: "Erro ao obter dados das tabelas" });
    }
}
