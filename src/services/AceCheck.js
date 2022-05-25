const AceCheck = (cards) => {
  let sum = 0;
  let aceIndex = [];
  for (let c in cards) {
    sum += cards[c][0];
    if (cards[c][0] === 11) {
      aceIndex.push(c);
    }
  }
  if (sum > 21 && aceIndex.length > 0) {
    for (let i = 0; i < aceIndex.length; i++) {
      if (sum < 21) return cards;
      cards[aceIndex[i]][0] = 1;
      sum -= 10;
    }
    return cards;
  }
  return cards;
};

module.exports = AceCheck;
