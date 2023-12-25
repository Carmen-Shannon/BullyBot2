const { getVoiceConnection } = require("@discordjs/voice");
const playVideo = require("../services/PlayVideo");

const Skip = async (interaction, queue, currentAudioSub) => {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return await interaction.reply("You must be in a voice channel to do that");
  }

  let connection = getVoiceConnection(voiceChannel.guild.id);

  if (!connection || queue.length === 0 || !currentAudioSub) {
    return await interaction.reply("No current audio to skip");
  }

  if (queue.length === 1) {
    await skip(queue, currentAudioSub, interaction);
    connection.receiver.voiceConnection.destroy();
    return currentAudioSub;
  }

  await skip(queue, currentAudioSub, interaction);
  await interaction.followUp(`Playing ${queue[0].title}`);
  currentAudioSub = await playVideo(
    (queue[0].duration.seconds + 1) * 1000,
    connection,
    queue,
    interaction
  );

  return currentAudioSub;
};

const skip = async (queue, currentAudioSub, interaction) => {
  await queue.shift();
  await currentAudioSub[0].player.stop();
  clearTimeout(currentAudioSub[1]);
  await interaction.reply(`Skipping current audio...`);
};

module.exports = Skip;
