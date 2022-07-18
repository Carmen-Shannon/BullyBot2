const Casino = require("../schemas/CasinoSchema");
const { MessageCollector } = require("discord.js");
const AddRep = require("../services/AddRep");
const TryCheck = require("../services/TryCheck");

const NumberGame = async (interaction, client) => {
  let player = await Casino.findOne({ discordId: interaction.member.id });
  if (!player) {
    player = await Casino.create({
      discordId: interaction.member.id,
      name: interaction.member.displayName,
      money: 500,
      wins: 0,
      debt: 0,
      reputation: 15,
      losses: 0,
    });
  }

  let betting = true;
  let bet = 0;
  let playing = false;
  let choosingDifficulty = false;
  let difficulty = 1;
  let tries = 2;
  let cpuChoice = 0;
  let guessing = false;
  await interaction.reply(
    `How much would you like to bet? You have $${player.money} available.`
  );
  const collector = new MessageCollector(
    interaction.channel,
    (message) => message.author.id == interaction.member.id,
    { time: 10000 }
  );
  collector.on("collect", async (message) => {
    if (message.author.id === client.user.id) {
      return;
    }
    if (isNaN(parseInt(message.content)) && betting) {
      return await message.reply("You must enter a number");
    }
    if (parseInt(message.content) < 0 && betting) {
      return await message.reply("You can not bet a negative number");
    }
    if (parseInt(message.content) > player.money && betting) {
      return await message.reply(
        "You can not bet more than what you currently have"
      );
    } else if (betting) {
      betting = false;
      choosingDifficulty = true;
      bet = parseInt(message.content);
      await message.reply(`Bet accepted - $${message.content}`);
      await message.reply(
        "Please select a difficulty 1-5 (1 - easiest | 5 - hardest)"
      );
    } else if (choosingDifficulty) {
      if (
        isNaN(parseInt(message.content)) ||
        parseInt(message.content) > 5 ||
        parseInt(message.content) < 1
      ) {
        await message.reply("You need to enter a number 1 through 5");
      }
      if (parseInt(message.content) > 0 && parseInt(message.content) < 6) {
        difficulty = parseInt(message.content);
        if (
          parseInt(message.content) === 2 ||
          parseInt(message.content) === 3 ||
          parseInt(message.content) === 5
        ) {
          tries += 1;
        } else if (parseInt(message.content) === 4) {
          tries += 2;
        }
        choosingDifficulty = false;
        guessing = true;
      }
      if (!choosingDifficulty) {
        await message.reply(
          `You have ${tries} tries to guess a number 1 - ${10 * difficulty}`
        );
        playing = true;
      }
      cpuChoice = Math.floor(Math.random() * (difficulty * 10));
    } else if (playing) {
      console.log(tries, cpuChoice);
      if (
        parseInt(message.content) > 10 * difficulty ||
        parseInt(message.content) < 1 ||
        isNaN(parseInt(message.content))
      ) {
        await message.reply(`Guess a number between 1 and ${10 * difficulty}`);
      } else if (parseInt(message.content) === cpuChoice) {
        await message.reply(
          `You guessed the number! You win ${difficulty} times your bet of $${bet}  ($${
            difficulty * bet
          })`
        );
        await Casino.updateOne(
          { discordId: interaction.member.id },
          { money: (player.money += bet * difficulty) }
        );
        await AddRep(interaction, bet, difficulty, player);
        playing = false;
        collector.stop();
      } else if (
        parseInt(message.content) > cpuChoice &&
        parseInt(message.content) < difficulty * 10
      ) {
        await message.reply("Too high");
        tries -= 1;
        await TryCheck(
          interaction,
          playing,
          bet,
          collector,
          tries,
          message,
          cpuChoice,
          player,
          difficulty
        );
      } else if (
        parseInt(message.content) < cpuChoice &&
        parseInt(message.content) > 0
      ) {
        await message.reply("Too low");
        tries -= 1;
        await TryCheck(
          interaction,
          playing,
          bet,
          collector,
          tries,
          message,
          cpuChoice,
          player,
          difficulty
        );
      }
    }
  });
};

module.exports = NumberGame;
