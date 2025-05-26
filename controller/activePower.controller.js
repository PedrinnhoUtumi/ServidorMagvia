const activePowerDAO = require('../model/activePower.dao');

exports.adicionaActivePower = async (ultimoDadoMQTT) => {
    return activePowerDAO.adicionaActivePower(ultimoDadoMQTT);
}