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

exports.getHash = async (senha) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(senha, salt);
  return hash;
};

exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, role, account } = req.body;

    if (!nome || !email || !senha || !role || !account) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const hash = await exports.getHash(senha);

    const novoUsuario = {
      nome,
      email,
      senha: hash,
      role,
      account,
    };

    const resultado = await myUserDAO.adicionaUser(novoUsuario);
    delete resultado.senha;

    return res.status(201).json({ usuario: resultado, message: "Usuário criado com sucesso." });
  } catch (error) {
    console.error("Erro ao adicionar usuário:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};
