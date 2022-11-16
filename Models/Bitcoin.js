const mongoose = require("mongoose");

const BitcoinSchema = new mongoose.Schema({
  price: {
    type: Number,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bitcoin", BitcoinSchema);