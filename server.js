const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 1883;

app.use(cors());
app.use(express.json());

const url = 'http://192.168.10.250:5654/db/query';

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="theme-color" content="#FFAA00" />
            <title>Informações do ISBN</title>
        </head>
        <body>
            <h1 style='background-color: #FFAA00;'>Olá Mundo</h1>
        </body>
        </html>
    `);
});

app.get('/api/machbase', (req, res) => {
    const query = {
        q: `SELECT * FROM ARCOND`,
        format: "json",
        timeformat: "default",
        tz: "local",
        precision: 2,
    };

    axios.post(url, query, {
        auth: {
            username: 'sys',
            password: 'manager',
        }
    })
    .then((response) => {
        res.json(response.data);
    })
    .catch((error) => {
        console.error('Erro ao conectar com o Machbase:', error.message);
        res.status(500).json({ error: 'Erro ao conectar com o Machbase' });
    });
});

app.listen(port, () => {
    console.log(`Servidor Node.js rodando na porta ${port}`);
});


