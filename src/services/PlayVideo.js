const { createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

const playVideo = async (timeout, connection, queue, interaction) => {
  const stream = await play.stream(queue[0].url);
  const audioStream = createAudioResource(stream.stream, {
    inputType: stream.type,
  });
  const player = createAudioPlayer();
  const sub = connection.subscribe(player);
  player.play(audioStream);
  if (sub) {
    const timeoutObj = setTimeout(async () => {
      await queue.shift();
      if (queue.length === 0) {
        connection.disconnect();
        sub.unsubscribe();
        await interaction.followUp(`Queue finished.`);
      } else {
        await interaction.followUp(`Playing ${queue[0].title}`);
        await playVideo(
          (queue[0].duration.seconds + 1) * 1000,
          connection,
          queue,
          interaction
        );
      }
    }, timeout);
    return [sub, timeoutObj];
  }
};

module.exports = playVideo;
