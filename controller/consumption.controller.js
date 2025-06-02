const consumptionDAO = require('../model/dao/consumption.dao');

exports.adicionaConsumption = async (ultimoDadoMQTT) => {
    return consumptionDAO.adicionaConsumption(ultimoDadoMQTT);
}