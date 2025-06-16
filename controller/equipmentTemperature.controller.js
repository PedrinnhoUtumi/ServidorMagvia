const equipmentTemperatureDAO = require('../model/dao/equipmentTemperature.dao');

exports.adicionaEquipmentTemperature = async (ultimoDadoMQTT) => {
    return equipmentTemperatureDAO.adicionaEquipmentTemperature(ultimoDadoMQTT);
}