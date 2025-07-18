const axios = require("axios");

exports.adicionaUser = async (novoUsuario) => {
  const url = "http://192.168.3.84:5654/db/query";

  const maxIdQuery = `SELECT MAX(ID) AS MAX_ID FROM MYUSER`;
  const maxIdResponse = await axios.post(
    url,
    { q: maxIdQuery },
    {
      auth: {
        username: "sys",
        password: "manager",
      },
    }
  );

  let novoId = 1;
  const resultado = maxIdResponse.data.data.rows[0][0];
  if (resultado) {
    novoId = resultado + 1;
  }

  // 👉 Hash da senha antes de salvar:
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(novoUsuario.senha, salt);

  const query = `
    INSERT INTO MYUSER (ID, NAME, EMAIL, SENHA, ROLE, ACCOUNT)
    VALUES ('${novoId}', '${novoUsuario.nome}', '${novoUsuario.email}', '${senhaHash}', '${novoUsuario.role}', '${novoUsuario.account}')
  `;

  await axios.post(
    url,
    { q: query },
    {
      auth: {
        username: "sys",
        password: "manager",
      },
    }
  );

  return "Usuario criado com sucesso";
};

exports.alteraUser = async (usuarioAlterado, id) => {
  const url = "http://192.168.3.84:5654/db/query";
  // const url = "http://192.168.3.8:5654/db/query";
  // const url = "http://192.168.10.250:5654/db/query";

  const query = `
    UPDATE MYUSER SET NAME = '${usuarioAlterado.nome}', EMAIL = '${usuarioAlterado.email}', ROLE = '${usuarioAlterado.role}', ACCOUNT = '${usuarioAlterado.account}' where id = ${id};
  `;
  const response = await axios.post(
    url,
    { q: query },
    {
      auth: {
        username: "sys",
        password: "manager",
      },
    }
  );
  return "Usuario alterado com sucesso";
};


exports.getUserByEmail = async (email) => {
  const url = "http://192.168.3.84:5654/db/query";

  const query = `SELECT * FROM MYUSER WHERE EMAIL = '${email}'`;
  
  const response = await axios.post(
    url,
    { q: query },
    {
      auth: {
        username: "sys",
        password: "manager",
      },
    }
  );
  console.log("Response from getUserByEmail:", response.data);

  const rows = response.data.data.rows;
  console.log("Rows from getUserByEmail:", rows);

  if (rows.length === 0) return null;

  // Mapear o resultado conforme a ordem das colunas:
  return {
    ID: rows[0][0],
    NAME: rows[0][1],
    EMAIL: rows[0][2],
    SENHA: rows[0][3],
    ROLE: rows[0][4],
    ACCOUNT: rows[0][5],
  };
};