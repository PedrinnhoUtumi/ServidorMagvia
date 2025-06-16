const reactivePowerDAO = require('../model/dao/reactivePower.dao');

exports.adicionaReactivePower = async (ultimoDadoMQTT) => {
    return reactivePowerDAO.adicionaReactivePower(ultimoDadoMQTT);
}