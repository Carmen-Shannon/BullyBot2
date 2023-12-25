const axios = require("axios");

const Motivate = async (interaction) => {
  try {
    let quote = await axios.get("https://zenquotes.io/api/random");
    return await interaction.reply({
      content: `"${quote.data[0].q}" - ${quote.data[0].a}`,
      tts: true,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = Motivate;
