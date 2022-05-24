const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const ytSearch = require("yt-search");
const play = require("play-dl");

const Play = async (interaction) => {
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

  const videoFinder = async (query) => {
    const result = await ytSearch(query);
    return result.videos.length > 1 ? result.videos[0] : null;
  };

  const video = await videoFinder(interaction.options.getString("search"));

  if (video) {
    const stream = await play.stream(video.url);
    const audioStream = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    const player = createAudioPlayer();
    connection.subscribe(player);
    player.play(audioStream);
    return await interaction.reply(`Playing ${video.title}`);
  }
  return await interaction.reply("Error fetching video");
};

module.exports = Play;
