const Casino = require("../schemas/CasinoSchema");
const CreatePlayer = require("../services/CreatePlayer");
const Gamble = require("./Gamble");

const Refill = async (interaction) => {
  const foundPlayer = await Casino.findOne({
    discordId: interaction.member.id,
  });

  if (!foundPlayer) {
    await interaction.reply(
      "You did not have a wallet, one has been created for you."
    );
    await Gamble(interaction);
  } else {
    if (foundPlayer.money === 0) {
      if (foundPlayer.reputation < 1) {
        await Casino.updateOne(
          { discordId: interaction.member.id },
          {
            money: 100,
            reputation: Math.floor(Math.abs(foundPlayer.reputation / 2)),
          }
        );
        await interaction.reply("You have a bad reputation, you now have $100");
      } else if (foundPlayer.reputation > 0 && foundPlayer.reputation < 21) {
        await Casino.updateOne(
          { discordId: interaction.member.id },
          {
            money: 500,
            reputation: Math.floor(Math.abs(foundPlayer.reputation / 2)),
          }
        );
        await interaction.reply(
          "You have an okay reputation, you now have $500"
        );
      } else if (foundPlayer.reputation > 20 && foundPlayer.reputation < 51) {
        await Casino.updateOne(
          { discordId: interaction.member.id },
          {
            money: 700,
            reputation: Math.floor(Math.abs(foundPlayer.reputation / 2)),
          }
        );
        await interaction.reply(
          "You have a pretty good reputation, you now have $700"
        );
      } else if (foundPlayer.reputation > 50 && foundPlayer.reputation < 100) {
        await Casino.updateOne(
          { discordId: interaction.member.id },
          {
            money: 1000,
            reputation: Math.floor(Math.abs(foundPlayer.reputation / 2)),
          }
        );
        await interaction.reply(
          "You have a great reputation, you now have $1000"
        );
      } else if (foundPlayer.reputation > 100) {
        await Casino.updateOne(
          { discordId: interaction.member.id },
          {
            money: 1250,
            reputation: Math.floor(Math.abs(foundPlayer.reputation / 2)),
          }
        );
      }
    } else {
      await interaction.reply(
        "You can not refill your wallet if it's not empty. Go all in!"
      );
    }
  }
};

module.exports = Refill;
