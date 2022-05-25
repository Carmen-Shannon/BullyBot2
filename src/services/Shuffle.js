const ConvertCard = require("./ConvertCard");

const Shuffle = (cards, cardsint, deck) => {
  while (cards.length < 2) {
    let randInd = Math.floor(Math.random() * deck.length);
    cards.push(deck[randInd]);
    let converted = ConvertCard(deck[randInd]);
    cardsint.push(converted);
    deck.splice(randInd, 1);
  }
};

module.exports = Shuffle;
