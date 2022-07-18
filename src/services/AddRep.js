const Casino = require("../schemas/CasinoSchema");

const AddRep = async (interaction, bet, base, player) => {
  let extraRep = Math.round(bet * 0.0001);
  await Casino.updateOne(
    { discordId: interaction.member.id },
    { reputation: player.reputation + base + extraRep }
  );
};

module.exports = AddRep;
