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

let lastJobId = "Nenhum";
const TOKEN = process.env.DISCORD_TOKEN;
const CANAL_ID = '1502418752946573362';

// --- LISTA NEGRA (ITENS QUE NÃO TÊM VALOR SOZINHOS) ---
const blacklistWiki = [
    "default", "leaf", "combat", "clown", "splat", "glaze", "checker", "lovely", "lucky", "denim", "adorned",
    "high tech", "incision", "starlit", "nightfire", "caution", "sidewinder",
    "red", "blue", "green", "yellow", "orange", "purple", "white", "black"
];

// Captura de JobId do Discord
client.on('messageCreate', (message) => {
    if (message.channel.id !== CANAL_ID) return;

    let content = message.content.trim();
    if (!content && message.embeds.length > 0) {
        const embed = message.embeds[0];
        content = (embed.description || "") + " " + (embed.fields ? embed.fields.map(f => f.value).join(" ") : "");
    }

    const uuidRegex = /[a-f0-9-]{36}/i;
    const match = content.match(uuidRegex);

    if (match) {
        lastJobId = match[0];
        console.log(`✅ JobId Atualizado: ${lastJobId}`);
    }
});

// --- ROTA DE DECISÃO FINAL DO TRADE ---
// O robô envia os itens que estão no trade atual para cá
app.get('/api/check_final_trade', (req, res) => {
    const itemsRaw = req.query.items || ""; 
    const itemsNoTrade = itemsRaw.toLowerCase().split(",").filter(i => i !== "");

    // REGRA: Se houver PELO MENOS UM item que não seja lixo, ACEITA.
    const temItemValioso = itemsNoTrade.some(itemName => {
        const ehLixo = blacklistWiki.some(lixo => itemName === lixo || itemName.includes(lixo));
        const ehEvento = itemName.includes("202") || itemName.includes("xmas") || itemName.includes("halloween") || itemName.includes("event");
        
        // Se for evento ou NÃO estiver na lista negra, é valioso!
        return ehEvento || !ehLixo;
    });

    if (temItemValioso) {
        // Se tiver 1 Ice e 3 Comuns, ele entra aqui e ACEITA.
        res.send("ACEITAR"); 
    } else {
        // Se forem 4 itens comuns (lixo), ele entra aqui e CANCELA.
        res.send("CANCELAR"); 
    }
});

// Outros Endpoints
app.get('/api/next', (req, res) => res.send(lastJobId));
app.get('/', (req, res) => res.send("Sistema de Filtro MM2 Online"));

client.login(TOKEN);
app.listen(process.env.PORT || 10000, () => {
    console.log("Servidor rodando e pronto para filtrar trades!");
});
