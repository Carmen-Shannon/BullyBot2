const DeckGenerator = () => {
  const cards = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  const suites = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const deck = [];
  for (let c of cards) {
    for (let s of suites) {
      deck.push([c, s]);
    }
  }
  return deck;
};

module.exports = DeckGenerator;
