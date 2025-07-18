const myUserDAO = require('../model/dao/myUser.dao');
const bcrypt = require("bcryptjs");

exports.adicionaUser = async (novoUsuario) => {
    const resultado = await myUserDAO.adicionaUser(novoUsuario);
    return resultado;
}

exports.alteraUser = async (usuarioAlterado, id) => {
    const resultado = await myUserDAO.alteraUser(usuarioAlterado, id);
    return resultado;
}

exports.loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await myUserDAO.getUserByEmail(email);
    console.log("Usuario encontrado:", usuario);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.SENHA);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Remova a senha antes de devolver:
    delete usuario.SENHA;

    res.status(200).json({
      message: "Login bem-sucedido",
      usuario: usuario, 
      mensagem: true
    });

  } catch (error) {
    console.error("Erro ao logar:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};