const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("../private/token.json");
const mongoose = require("mongoose");
const Join = require("./commands/Join");
const Leave = require("./commands/Leave");
const Play = require("./commands/Play");
const Stop = require("./commands/Stop");
const Gamble = require("./commands/Gamble");
const Motivate = require("./commands/Motivate");
const Blackjack = require("./commands/Blackjack");
const Refill = require("./commands/Refill");
const NumberGame = require("./commands/NumberGame");
const Skip = require("./commands/Skip");
const Intents = GatewayIntentBits;
const client = new Client({
  intents: [
    Intents.Guilds,
    Intents.GuildMessages,
    Intents.GuildVoiceStates,
    Intents.MessageContent,
  ],
});

var queue = [];
var currentAudioSub;

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
    currentAudioSub = await Play(interaction, queue, currentAudioSub);
  }
  if (interaction.commandName === "skip") {
    currentAudioSub = await Skip(interaction, queue, currentAudioSub);
  }
  if (interaction.commandName === "stop") {
    await Stop(interaction, currentAudioSub, queue);
  }
  if (interaction.commandName === "gamble") {
    if (interaction.member.id === client.user.id) {
      return;
    }
    await Gamble(interaction);
  }
  if (interaction.commandName === "motivate") {
    await Motivate(interaction);
  }
  if (interaction.commandName === "blackjack") {
    await Blackjack(interaction, client);
  }
  if (interaction.commandName === "refill") {
    await Refill(interaction);
  }
  if (interaction.commandName === "number") {
    await NumberGame(interaction, client);
  }
});

client.login(token);
