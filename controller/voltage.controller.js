const voltageDAO = require('../model/dao/voltage.dao');

exports.adicionaVoltage = async (ultimoDadoMQTT) => {
    return voltageDAO.adicionaVoltage(ultimoDadoMQTT);
}