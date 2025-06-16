const apparentPowerDAO = require('../model/dao/apparentPower.dao');

exports.adicionaApparentPower = async (ultimoDadoMQTT) => {
    return apparentPowerDAO.adicionaApparentPower(ultimoDadoMQTT);
}