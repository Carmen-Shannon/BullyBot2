const SumCards = (cards) => {
  let sum = 0;
  for (let i = 0; i < cards.length; i++) {
    sum += cards[i][0];
  }
  return sum;
};

module.exports = SumCards;
