const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, token, guildId } = require("../../private/token.json");

const commands = [
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays audio")
    .addStringOption((input) =>
      input
        .setName("search")
        .setDescription("Search for youtube")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Connects bot to current voice channel"),
  new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Disconnects the bot manually from voice"),

  new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the audio that is currently playing"),

  new SlashCommandBuilder()
    .setName("gamble")
    .setDescription(
      "If you don't already have a wallet this command will create one for you"
    ),

  new SlashCommandBuilder()
    .setName("motivate")
    .setDescription("Motivates the voice discord channel"),

  new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("Play Blackjack 21 with a live deck of cards"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
