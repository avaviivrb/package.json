const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Configuração do Bot do Discord
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Variável global para guardar o último JobId recebido
let lastJobId = "Nenhum ID recebido ainda";

// Puxa o Token das variáveis de ambiente do Render
const TOKEN = process.env.DISCORD_TOKEN;

// Verifica se o Token existe antes de tentar ligar
if (!TOKEN) {
    console.error("Erro ao logar: Token inválido ou faltando nas Environment Variables!");
    process.exit(1);
}

// Evento quando o bot liga
client.on('ready', () => {
    console.log(`Bot logado como ${client.user.tag}!`);
});

// Evento para ler mensagens no canal
client.on('messageCreate', (message) => {
    // Ignora mensagens do próprio bot
    if (message.author.bot) return;

    // Se a mensagem for um JobId (ex: apenas números e letras)
    // Você pode ajustar essa lógica se quiser um comando específico
    if (message.content.length > 20) { 
        lastJobId = message.content;
        console.log(`Novo JobId capturado: ${lastJobId}`);
    }
});

// ROTA QUE O ROBLOX VAI ACESSAR
// O Roblox deve fazer um Get para: https://seu-link.onrender.com/api/next
app.get('/api/next', (req, res) => {
    res.send(lastJobId);
});

// Rota inicial apenas para teste no navegador
app.get('/', (req, res) => {
    res.send("Servidor da Ponte está Online!");
});

// Tenta logar no Discord
client.login(TOKEN).catch(err => {
    console.error("Falha crítica no login do Discord:", err.message);
});

// Porta 10000 é a padrão exigida pelo Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
