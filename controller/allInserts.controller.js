    const voltageController = require("./voltage.controller");
    const currentController = require("./current.controller");
    const consumptionController = require("./consumption.controller");
    const generationController = require("./generation.controller");
    const activePowerController = require("./activePower.controller");

    exports.adicionaTodosOsDados = (ultimoDadoMQTT) => {
      voltageController.adicionaVoltage(ultimoDadoMQTT)
        .then(() => {
          console.log("Dados de tensão salvos com sucesso no banco de dados.");
        })
        .catch((error) => {
          console.error("Erro ao salvar dados de tensão no banco de dados:", error);
        })
  
      activePowerController.adicionaActivePower(ultimoDadoMQTT)
        .then(() => {
          console.log("Dados de Potência Ativa salvos com sucesso no banco de dados.");
        })
        .catch((error) => {
          console.error("Erro ao salvar dados no banco de dados:", error);
        });
  
      currentController.adicionaCurrent(ultimoDadoMQTT)
        .then(() => {
          console.log("Dados de Corrente salvos com sucesso no banco de dados.");
        })
        .catch((error) => {
          console.error("Erro ao salvar dados no banco de dados:", error);
        });
  
      consumptionController.adicionaConsumption(ultimoDadoMQTT)
        .then(() => {
          console.log("Dados de Consumo salvos com sucesso no banco de dados.");
        })
        .catch((error) => {
          console.error("Erro ao salvar dados no banco de dados:", error);
        });
  
      generationController.adicionaGeneration(ultimoDadoMQTT)
        .then(() => {
          console.log("Dados salvos com sucesso no banco de dados.");
        })
        .catch((error) => {
          console.error("Erro ao salvar dados no banco de dados:", error);
        });
    }