const { Collection, Client, Discord, GatewayIntentBits } = require("discord.js");
const express = require('express');
const server = express();
var listTK=[
  "MTE2ODE1NzAyMzY3OTA0MTU0Ng",
  "GRKKQ5",
  "5Iv23iWpf6VLVCT3HuMFhumbQIw4arOeMuuE70"
];

const brawlclient = new Client({
  partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER", "REACTION"],
  intents: ["GUILDS", "GUILD_VOICE_STATES"]
})
brawlclient.commands = new Collection();
const message = require("./events/message.js");
brawlclient.on('ready', () => {
  console.log('Brawl Prize is Active');
  message(brawlclient);
});

brawlclient.login(""+listTK[0]+"."+listTK[1]+"."+listTK[2]);

server.all(`/`, (req, res) => {
  res.send(`Please connect me to a hosting website in-order to work 24/7.`);
});

function keepAlive() {
  server.listen(3000, () => {
    console.log(`24/7 Activation Complete`);
  });
} 