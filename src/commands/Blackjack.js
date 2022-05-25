const DeckGenerator = require("../services/DeckGenerator");
const Casino = require("../schemas/CasinoSchema");
const Shuffle = require("../services/Shuffle");
const AceCheck = require("../services/Acecheck");
const SumCards = require("../services/SumCards");
const PullCard = require("../services/PullCard");
const { MessageCollector } = require("discord.js");

const Blackjack = async (interaction, client) => {
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
  let deck = DeckGenerator();
  let playercards = [];
  let playercardsint = [];
  let dealercards = [];
  let dealercardsint = [];
  let betting = true;
  let playing = false;
  let shuffling = false;
  let bet = 0;
  let staying = false;
  await interaction.reply(
    `How much would you like to bet? You have $${player.money} available`
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
    if (parseInt(message.content) > player.money && betting) {
      return await message.reply(
        "You can not bet more than what you currently have"
      );
    } else if (betting) {
      betting = false;
      playing = true;
      shuffling = true;
      bet = parseInt(message.content);
      await message.reply(`Bet accepted - $${message.content}`);
    }
    if (playing) {
      if (shuffling) {
        await message.reply("Shuffling cards...");
        Shuffle(playercards, playercardsint, deck);
        Shuffle(dealercards, dealercardsint, deck);
      }
      shuffling = false;
      AceCheck(playercardsint);
      AceCheck(dealercardsint);
      if (SumCards(playercards) === 21) {
        await message.reply(
          `Blackjack 21! You win 6x your bet ($${bet}) $${bet * 6}`
        );
        await Casino.updateOne(
          { discordId: interaction.member.id },
          {
            wins: player.wins + 1,
            money: player.money + bet * 6,
          }
        );
        playing = false;
        collector.stop("Game over");
      }
      if (message.content.toLowerCase() === "hit") {
        PullCard(playercards, playercardsint, deck);
        AceCheck(playercardsint);
        if (SumCards(playercardsint) > 21) {
          await message.reply(
            `You pulled ${
              playercards[playercards.length - 1]
            } you got ${SumCards(playercardsint)}`
          );
          await message.reply(`Player busted, house wins. You lost $${bet}`);
          await Casino.updateOne(
            { discordId: interaction.member.id },
            {
              losses: player.losses + 1,
              money: player.money - bet,
            }
          );
          playing = false;
          collector.stop("Game over");
          return;
        }
        if (SumCards(playercards) === 21) {
          await message.reply(
            `You pulled ${
              playercards[playercards.length - 1]
            } you got ${SumCards(playercardsint)}`
          );
          await message.reply(
            `Blackjack 21! You win 6x your bet ($${bet}) $${bet * 6}`
          );
          await Casino.updateOne(
            { discordId: interaction.member.id },
            {
              wins: player.wins + 1,
              money: player.money + bet * 6,
            }
          );
          playing = false;
          collector.stop("Game over");
          return;
        }
        await message.reply({
          content: `Your cards - [${playercards.map(
            (item) => item
          )}]\nDealer is showing - [${dealercards[0]}]`,
        });
        await message.reply({
          content: `You have ${SumCards(playercardsint)} - hit or stay?`,
        });
      } else if (message.content.toLowerCase() === "stay") {
        await message.reply(
          `Dealer has [${dealercards.map((item) => item)}] - ${SumCards(
            dealercardsint
          )}`
        );
        staying = true;
        while (
          SumCards(dealercardsint) < SumCards(playercardsint) &&
          SumCards(dealercardsint) < 21
        ) {
          PullCard(dealercards, dealercardsint, deck);
          AceCheck(dealercardsint);
          await message.reply(
            `Dealer pulls ${
              dealercards[dealercards.length - 1]
            }. Dealer now has ${SumCards(dealercardsint)}`
          );
        }
        if (SumCards(dealercardsint) === 21) {
          await message.reply({
            content: `House wins with 21, you lose $${bet}`,
          });
          await Casino.updateOne(
            { discordId: interaction.member.id },
            {
              losses: player.losses + 1,
              money: player.money - bet,
            }
          );
          playing = false;
          staying = false;
          collector.stop("Game over");
          return;
        }
        if (SumCards(dealercardsint) > 21) {
          await message.reply(
            `House busts, player wins 2x their bet ($${bet}) - $${bet * 2}!`
          );
          await Casino.updateOne(
            { discordId: interaction.member.id },
            {
              wins: player.wins + 1,
              money: player.money + bet * 2,
            }
          );
          playing = false;
          staying = false;
          collector.stop("Game over");
          return;
        }
        if (SumCards(dealercardsint) > SumCards(playercardsint)) {
          await message.reply({
            content: `House wins, you lose $${bet}`,
          });
          await Casino.updateOne(
            { discordId: interaction.member.id },
            {
              losses: player.losses + 1,
              money: player.money - bet,
            }
          );
          playing = false;
          staying = false;
          collector.stop("Game over");
          return;
        }
        if (SumCards(dealercardsint) === SumCards(playercardsint)) {
          await message.reply({
            content: `Draw - no money lost`,
          });
          playing = false;
          staying = false;
          collector.stop("Game over");
          return;
        }
      } else if (staying) {
        await message.reply(`Pulling dealer cards... please wait`);
        return;
      } else {
        if (SumCards(playercards) === 21) {
          await message.reply(
            `Blackjack 21! You win 6x your bet ($${bet}) $${bet * 6}`
          );
          await Casino.updateOne(
            { discordId: interaction.member.id },
            {
              wins: player.wins + 1,
              money: player.money + bet * 6,
            }
          );
          playing = false;
          collector.stop("Game over");
        }
        await message.reply({
          content: `Your cards - [${playercards[0]} - ${playercards[1]}]\nDealer is showing - [${dealercards[0]}]`,
        });
        await message.reply({
          content: `You have ${SumCards(playercardsint)} - hit or stay?`,
        });
      }
    }
  });
};

module.exports = Blackjack;
