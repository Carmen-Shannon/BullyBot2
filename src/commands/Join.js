const { joinVoiceChannel } = require("@discordjs/voice");

const Join = async (interaction) => {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return await interaction.reply("You must be in a voice channel first");
  }
  const connect = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    selfDeaf: false,
  });
  return await interaction.reply("Connecting to voice");
};

module.exports = Join;
