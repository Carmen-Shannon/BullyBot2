const ConvertCard = require("./ConvertCard");

const PullCard = (cards, cardsint, deck) => {
  let randInd = Math.floor(Math.random() * deck.length);
  cards.push(deck[randInd]);
  let converted = ConvertCard(deck[randInd]);
  cardsint.push(converted);
  deck.splice(randInd, 1);
};

module.exports = PullCard;
