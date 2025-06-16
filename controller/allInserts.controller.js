const voltageController = require("./voltage.controller");
const currentController = require("./current.controller");
const consumptionController = require("./consumption.controller");
const generationController = require("./generation.controller");
const activePowerController = require("./activePower.controller");
const apparentPowerController = require("./apparentPower.controller");
const frequencyController = require("./frequency.controller");
const powerFactorController = require("./powerFactor.controller");
const equipmentTemperatureController = require("./equipmentTemperature.controller");
const reactivePowerController = require("./reactivePower.controller");
const angleBetweenVoltageController = require("./angleBetweenVoltage.controller");
const angleVoltageCurrentController = require("./angleVoltageCurrent.controller");


exports.adicionaTodosOsDados = (ultimoDadoMQTT) => {
  voltageController
    .adicionaVoltage(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de tensão salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de tensão no banco de dados:", error);
    });

  activePowerController
    .adicionaActivePower(ultimoDadoMQTT)
    .then(() => {
      console.log(
        "Dados de Potência Ativa salvos com sucesso no banco de dados."
      );
    })
    .catch((error) => {
      console.error("Erro ao salvar dados no banco de dados:", error);
    });

  currentController
    .adicionaCurrent(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Corrente salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados no banco de dados:", error);
    });

  consumptionController
    .adicionaConsumption(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Consumo salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados no banco de dados:", error);
    });

  generationController
    .adicionaGeneration(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados no banco de dados:", error);
    });

  apparentPowerController
    .adicionaApparentPower(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Potência Aparente salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de Potência Aparente no banco de dados:", error);
    });

  frequencyController
    .adicionaFrequency(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Frequência salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de Frequência no banco de dados:", error);
    });

  powerFactorController
    .adicionaPowerFactor(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Fator de Potência salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de Fator de Potência no banco de dados:", error);
    });

  equipmentTemperatureController
    .adicionaEquipmentTemperature(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Temperatura do Equipamento salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de Temperatura do Equipamento no banco de dados:", error);
    });

  reactivePowerController
    .adicionaReactivePower(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Potência Reativa salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de Potência Reativa no banco de dados:", error);
    });

  angleBetweenVoltageController
    .adicionaAngleBetweenVoltage(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Ângulo entre Tensões salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de Ângulo entre Tensões no banco de dados:", error);
    });

  angleVoltageCurrentController
    .adicionaAngleVoltageCurrent(ultimoDadoMQTT)
    .then(() => {
      console.log("Dados de Ângulo entre Tensão e Corrente salvos com sucesso no banco de dados.");
    })
    .catch((error) => {
      console.error("Erro ao salvar dados de Ângulo entre Tensão e Corrente no banco de dados:", error);
    });

    
};
