const angleBetweenVoltageDAO = require('../model/dao/angleBetweenVoltage.dao');

exports.adicionaAngleBetweenVoltage = async (ultimoDadoMQTT) => {
    return angleBetweenVoltageDAO.adicionaAngleBetweenVoltage(ultimoDadoMQTT);
}