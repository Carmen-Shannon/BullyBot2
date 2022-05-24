const { joinVoiceChannel } = require("@discordjs/voice");

const Stop = async (interaction) => {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return await interaction.reply("You must be in a voice channel to do that");
  }
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    selfDeaf: false,
  });
  connection.receiver.voiceConnection.destroy();

  return await interaction.reply("Goodbye!");
};

module.exports = Stop;
