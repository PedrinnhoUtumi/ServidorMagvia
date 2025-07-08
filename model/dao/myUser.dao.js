const axios = require("axios");

exports.adicionaUser = async (novoUsuario) => {
  const url = "http://192.168.3.8:5654/db/query";
  // const url = "http://192.168.10.250:5654/db/query";
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
  console.log(maxIdResponse.data.data.rows[0][0]);

  const resultado = maxIdResponse.data.data.rows[0][0];
  if (resultado) {
    novoId = resultado + 1;
  }

  console.log(`Novo ID: ${novoId}`);

  const query = `
    INSERT INTO MYUSER (ID, NAME, EMAIL, SENHA, ROLE, ACCOUNT)
    VALUES ('${novoId}', '${novoUsuario.nome}', '${novoUsuario.email}', '${novoUsuario.senha}', '${novoUsuario.role}', '${novoUsuario.account}')
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
  return "Usuario criado com sucesso";
};

exports.alteraUser = async (usuarioAlterado, id) => {
  const url = "http://192.168.3.8:5654/db/query";
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
