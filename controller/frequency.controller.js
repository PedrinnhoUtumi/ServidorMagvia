const frequencyDAO = require('../model/dao/frequency.dao');

exports.adicionaFrequency = async (ultimoDadoMQTT) => {
    return frequencyDAO.adicionaFrequency(ultimoDadoMQTT);
}