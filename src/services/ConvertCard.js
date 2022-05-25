const ConvertCard = (card) => {
  let copy = [...card];
  switch (copy[0]) {
    case "K":
      copy[0] = 10;
      break;
    case "J":
      copy[0] = 10;
      break;
    case "Q":
      copy[0] = 10;
      break;
    case "A":
      copy[0] = 11;
      break;
  }
  return copy;
};

module.exports = ConvertCard;
