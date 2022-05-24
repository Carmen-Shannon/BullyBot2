const Casino = require("../schemas/CasinoSchema");

const Gamble = async (interaction) => {
  if (interaction.member.id === client.user.id) {
    return;
  }
  const foundPlayer = await Casino.findOne({
    discordId: interaction.member.id,
  });
  if (!foundPlayer) {
    const newPlayer = await Casino.create({
      discordId: interaction.member.id,
      name: interaction.member.displayName,
      money: 500,
      wins: 0,
      debt: 0,
      reputation: 15,
      losses: 0,
    });
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
