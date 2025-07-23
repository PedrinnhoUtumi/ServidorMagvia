const express = require('express');
const router = express.Router();


const { buscarUltimosDoisPorTabela } = require('../model/dao/machbase.dao');

router.get('/ultimos', async (req, res) => {
  try {
    const dados = await buscarUltimosDoisPorTabela();
    res.json({
      insercao: dados.insercao || null,
      semInsercao: dados.semInsercao || null,
    });
  } catch (err) {
    console.error('Erro no endpoint /ultimos:', err.message);
    res.status(500).json({ erro: 'Erro ao buscar últimos dados.' });
  }
});

module.exports = router;
