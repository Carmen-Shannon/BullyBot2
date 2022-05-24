const { Client, Intents } = require("discord.js");
const { token } = require("../private/token.json");
const mongoose = require("mongoose");
const Join = require("./commands/Join");
const Leave = require("./commands/Leave");
const Play = require("./commands/Play");
const Stop = require("./commands/Stop");
const Gamble = require("./commands/Gamble");
const Motivate = require("./commands/Motivate");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.once("ready", () => {
  mongoose
    .connect("mongodb://localhost/bullybot", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    })
    .then(() => console.log("---------- Connected to database ----------"))

    .catch((error) => console.log(error));
  console.log(`Bot is running - ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.username.toLowerCase() === "nrtz") {
    return await message.reply("rat");
  }
  return;
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "join") {
    await Join(interaction);
  }
  if (interaction.commandName === "leave") {
    await Leave(interaction);
  }
  if (interaction.commandName === "play") {
    await Play(interaction);
  }
  if (interaction.commandName === "stop") {
    await Stop(interaction);
  }
  if (interaction.commandName === "gamble") {
    await Gamble(interaction);
  }
  if (interaction.commandName === "motivate") {
    await Motivate(interaction);
  }
  if (interaction.commandName === "blackjack") {
    const cards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    const suites = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const deck = [];
    const playerCards = [];
    const dealerCards = [];
    for (let c of cards) {
      for (let s of suites) {
        deck.push([c, s]);
      }
    }
    let isGambling = true;

    client.once("messageCreate", async (message) => {
      await message.reply("Success! - " + message.content);
      isGambling = false;
    });
  }
});

client.login(token);
