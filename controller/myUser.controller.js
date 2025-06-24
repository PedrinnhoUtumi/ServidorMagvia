const myUserDAO = require('../model/dao/myUser.dao');

exports.adicionaUser = async (novoUsuario) => {
    const resultado = await myUserDAO.adicionaUser(novoUsuario);
    return resultado;
}

exports.alteraUser = async (usuarioAlterado, id) => {
    const resultado = await myUserDAO.alteraUser(usuarioAlterado, id);
    return resultado;
}