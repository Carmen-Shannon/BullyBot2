const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const playVideo = require("../services/PlayVideo.js");
const videoFinder = require("../services/VideoFinder.js");

const Play = async (interaction, queue, currentAudioSub) => {
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return await interaction.reply("You must be in a voice channel to do that");
  }

  let connection = getVoiceConnection(voiceChannel.guild.id);

  if (!connection) {
    connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
  }

  const video = await videoFinder(interaction.options.getString("search"));
  await queue.push(video);

  if (queue.length === 1) {
    await interaction.reply(`Playing ${queue[0].title}`);
    currentAudioSub = await playVideo(
      (queue[0].duration.seconds + 1) * 1000,
      connection,
      queue,
      interaction
    );
  } else {
    await interaction.reply(
      `Adding video to queue - ${video.title}\nPosition after current song - ${
        queue.length - 1
      }`
    );
  }

  return currentAudioSub;
};

module.exports = Play;
