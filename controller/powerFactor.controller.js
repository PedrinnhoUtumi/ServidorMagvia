const powerFactorDAO = require('../model/dao/powerFactor.dao');

exports.adicionaPowerFactor = async (ultimoDadoMQTT) => {
    return powerFactorDAO.adicionaPowerFactor(ultimoDadoMQTT);
}