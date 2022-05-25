const axios = require("axios");

const Motivate = async (interaction) => {
  try {
    let quote = await axios.get("https://zenquotes.io/api/random");
    await interaction.channel.send({
      content: `"${quote.data[0].q}" - ${quote.data[0].a}`,
      tts: true,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = Motivate;
