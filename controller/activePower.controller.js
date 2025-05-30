const activePowerDAO = require('../model/dao/activePower.dao');

exports.adicionaActivePower = async (ultimoDadoMQTT) => {
    return activePowerDAO.adicionaActivePower(ultimoDadoMQTT);
}