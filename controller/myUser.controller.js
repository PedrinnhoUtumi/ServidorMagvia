const myUserDAO = require('../model/dao/myUser.dao');

exports.adicionaUser = async (novoUsuario) => {
    const resultado = await myUserDAO.adicionaUser(novoUsuario);
    return resultado;
}