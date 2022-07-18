const Casino = require("../schemas/CasinoSchema");
const RemRep = require("../services/RemRep");

const TryCheck = async (
  interaction,
  playing,
  bet,
  collector,
  tries,
  message,
  cpuChoice,
  player,
  difficulty
) => {
  if (tries === 0) {
    playing = false;
    await message.reply(
      `You did not guess the number, it was ${cpuChoice}. You lost $${bet}`
    );
    await Casino.updateOne(
      { discordId: interaction.member.id },
      { money: (player.money -= bet) }
    );
    await RemRep(interaction, bet, difficulty, player);
    collector.stop();
    return;
  }
};

module.exports = TryCheck;
