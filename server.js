const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Configuração do Bot com as permissões que você ativou
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

let lastJobId = "Nenhum ID recebido ainda";
const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
    console.error("Erro: Variável DISCORD_TOKEN não encontrada no Render!");
    process.exit(1);
}

client.on('ready', () => {
    console.log(`Bot logado como ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    let content = message.content.trim();

    // Lógica para ler o comando da Screenshot_2026-05-13-13-25-11-256_com.discord.jpg
    if (content.includes('TeleportToPlaceInstance')) {
        // Extrai apenas o código que fica entre as últimas aspas
        const regex = /'([^']+)'\s*\)$/; 
        const match = content.match(regex);
        
        if (match && match[1]) {
            lastJobId = match[1];
            console.log(`JobId extraído do comando: ${lastJobId}`);
        }
    } 
    // Se você mandar apenas o ID ou o link do servidor
    else if (content.length > 15) {
        lastJobId = content;
        console.log(`Novo JobId capturado: ${lastJobId}`);
    }
});

// Rota que o seu script do Roblox vai acessar
app.get('/api/next', (req, res) => {
    res.send(lastJobId);
});

// Rota para você testar no navegador do celular
app.get('/', (req, res) => {
    res.send(`Servidor Online. Último JobId: ${lastJobId}`);
});

client.login(TOKEN).catch(err => {
    console.error("Erro ao conectar no Discord:", err.message);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
