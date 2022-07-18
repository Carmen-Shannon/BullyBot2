const Casino = require("../schemas/CasinoSchema");

const CreatePlayer = async (interaction) => {
  const newPlayer = await Casino.create({
    discordId: interaction.member.id,
    name: interaction.member.displayName,
    money: 500,
    wins: 0,
    debt: 0,
    reputation: 15,
    losses: 0,
  });
};

module.exports = CreatePlayer;
