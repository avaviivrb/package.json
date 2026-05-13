const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

let lastJobId = "Nenhum ID recebido ainda";
const TOKEN = process.env.DISCORD_TOKEN;
const CANAL_ID = '1502418752946573362'; // ID do chat que você forneceu

if (!TOKEN) {
    console.error("Erro: DISCORD_TOKEN não configurado no Render!");
    process.exit(1);
}

client.on('ready', () => {
    console.log(`Bot conectado! Escutando Webhooks no canal: ${CANAL_ID}`);
});

client.on('messageCreate', (message) => {
    // Só processa se for no canal específico
    if (message.channel.id !== CANAL_ID) return;

    let content = message.content.trim();

    // Se o Webhook mandar a info em um Embed (caixinha)
    if (!content && message.embeds.length > 0) {
        const embed = message.embeds[0];
        content = embed.description || "";
        if (!content && embed.fields.length > 0) {
            content = embed.fields.map(f => f.value).join(" ");
        }
    }

    // 1. Tenta extrair de dentro do comando TeleportToPlaceInstance
    if (content.includes('TeleportToPlaceInstance')) {
        const regex = /'([^']+)'\s*\)$/; 
        const match = content.match(regex);
        if (match && match[1]) {
            lastJobId = match[1];
            console.log(`JobId extraído do comando: ${lastJobId}`);
        }
    } 
    // 2. Se for um UUID puro (formato 36 caracteres com hífens)
    else {
        const uuidRegex = /[a-f0-9-]{36}/i;
        const match = content.match(uuidRegex);
        if (match) {
            lastJobId = match[0];
            console.log(`UUID detectado: ${lastJobId}`);
        } else if (content.length > 10) {
            // 3. Fallback: Se for qualquer outro texto longo
            lastJobId = content;
            console.log(`Texto capturado: ${lastJobId}`);
        }
    }
});

// Endpoint para o Roblox
app.get('/api/next', (req, res) => {
    res.send(lastJobId);
});

// Endpoint para teste no navegador
app.get('/', (req, res) => {
    res.send(`Servidor Online. Último JobId capturado: ${lastJobId}`);
});

client.login(TOKEN);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
