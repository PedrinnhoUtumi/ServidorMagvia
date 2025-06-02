const currentDAO = require('../model/dao/current.dao');

exports.adicionaCurrent = async (ultimoDadoMQTT) => {
    return currentDAO.adicionaCurrent(ultimoDadoMQTT);
}