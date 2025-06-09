const allInsertsController = require("./controller/allInserts.controller");
const mqtt = require("mqtt");
const mqttUrl = "ws://192.168.10.250:5654/web/api/mqtt";

const mqttOptions = {
  clean: true,
  connectTimeout: 4000,
  protocolVersion: 5,
};

const mqttClient = mqtt.connect(mqttUrl, mqttOptions);
exports.ativaConexaoMQTT = () => {
    let ultimoDadoMQTT = {}; 
    mqttClient.on("connect", () => {
      console.log("Conectado ao broker MQTT");
      mqttClient.subscribe("/api/energia/monitor", (err) => {
        if (!err) {
          console.log("Inscrito no tópico /api/energia/monitor");
        } else {
          console.error("Erro ao se inscrever:", err);
        }
      });
    });
    
    mqttClient.on("message", (topic, message) => {
      console.log("Tópico:", topic);
      console.log("Mensagem recebida:", message.toString());
      if (topic === "/api/energia/monitor") {
        const dados = JSON.parse(message.toString());
        console.log("Dados recebidos:", dados);
        ultimoDadoMQTT = {
          timestamp: new Date().toISOString(),
          ...dados,
        };
        allInsertsController.adicionaTodosOsDados(ultimoDadoMQTT)
      }
    });
    
    mqttClient.on("error", (err) => {
      console.error("Erro no MQTT:", err.message);
    });
    return ultimoDadoMQTT;
}
