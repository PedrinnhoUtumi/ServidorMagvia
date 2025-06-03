const generationDAO = require('../model/dao/generation.dao');

exports.adicionaGeneration = async (ultimoDadoMQTT) => {
    return generationDAO.adicionaGeneration(ultimoDadoMQTT);
}