const mongoose = require("mongoose");

const CasinoSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    },
    wins: {
      type: Number,
      required: true,
    },
    losses: {
      type: Number,
      required: true,
    },
    debt: {
      type: Number,
      required: true,
    },
    reputation: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Casino = mongoose.model("casino", CasinoSchema);

module.exports = Casino;
