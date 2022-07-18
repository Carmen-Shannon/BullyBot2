const Casino = require("../schemas/CasinoSchema");
const CreatePlayer = require("../services/CreatePlayer");

const Gamble = async (interaction) => {
  const foundPlayer = await Casino.findOne({
    discordId: interaction.member.id,
  });
  if (!foundPlayer) {
    await CreatePlayer(interaction);
    await interaction.reply(
      "You have successfully created a wallet, you will start off with $500"
    );
  } else {
    await interaction.reply(
      `You currently have $${foundPlayer.money}, ${foundPlayer.wins} wins, ${
        foundPlayer.losses
      } losses, ${foundPlayer.reputation} reputation and ${
        foundPlayer.debt > 0
          ? "you are currently $" + foundPlayer.debt + " in debt"
          : "you are not in debt"
      }`
    );
  }
};

module.exports = Gamble;
