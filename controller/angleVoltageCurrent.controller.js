const angleVoltageCurrentDAO = require('../model/dao/angleVoltageCurrent.dao');

exports.adicionaAngleVoltageCurrent = async (ultimoDadoMQTT) => {
    return angleVoltageCurrentDAO.adicionaAngleVoltageCurrent(ultimoDadoMQTT);
}