const ytSearch = require("yt-search");

const videoFinder = async (query) => {
  const result = await ytSearch(query);
  return result.videos.length > 1 ? result.videos[0] : null;
};

module.exports = videoFinder;
