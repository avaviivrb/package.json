const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

let lastJobId = "Nenhum";
const CANAL_ID = '1502418752946573362';

// BLACKLIST BASEADA NA WIKI (Itens de caixas padrão que NÃO devem ser pegos)
const blacklistWiki = [
    // Comuns (Box 1-5)
    "default", "leaf", "combat", "clown", "splat", "glaze", "checker", "lovely", "lucky", "denim", "adorned",
    // Incomuns (Box 1-5)
    "high tech", "incision", "starlit", "nightfire", "caution", "sidewinder",
    // Cores básicas (Cores sólidas de caixas comuns)
    "red", "blue", "green", "yellow", "orange", "purple", "white", "black"
];

client.on('messageCreate', (message) => {
    if (message.channel.id !== CANAL_ID) return;
    
    let content = (message.content + " " + (message.embeds[0]?.description || "")).toLowerCase();
    const uuidRegex = /[a-f0-9-]{36}/i;
    const match = content.match(uuidRegex);

    if (match) {
        lastJobId = match[0];
        console.log("✅ JobId capturado!");
    }
});

// API de Verificação para o Roblox
app.get('/api/check_item', (req, res) => {
    const itemName = (req.query.name || "").toLowerCase();

    // 1. REGRA: PASSE LIVRE PARA EVENTOS E ITENS RAROS
    // Se o nome tiver ano (2023, 2024), "xmas", "halloween", "gift" ou "bundle", libera direto.
    if (itemName.includes("202") || itemName.includes("xmas") || itemName.includes("halloween") || itemName.includes("event") || itemName.includes("bundle")) {
        return res.send("LIBERADO");
    }

    // 2. REGRA: VERIFICAÇÃO NA BLACKLIST (ITENS DE CAIXA PADRÃO)
    // Bloqueia se o nome for EXATAMENTE uma cor básica ou estiver na lista de lixos.
    const ehLixo = blacklistWiki.some(lixo => itemName === lixo || itemName.includes(lixo));

    if (ehLixo) {
        res.send("BLOQUEADO");
    } else {
        res.send("LIBERADO"); // Tudo que não é lixo padrão (Godly, Ancient, etc) é pego.
    }
});

app.get('/api/next', (req, res) => res.send(lastJobId));

client.login(process.env.DISCORD_TOKEN);
app.listen(process.env.PORT || 10000);
