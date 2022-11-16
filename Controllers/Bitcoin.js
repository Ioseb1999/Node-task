const Bitcoin = require("../Models/Bitcoin");

const getBitcoins = (req, res) => {
  try {
    Bitcoin.find((error, bitcoin) => {
      if (error) {
        res.status(400).send({ message: "Cannot get Bitcoin!" });
      }
      res.json(bitcoin);
    });
  } catch (error) {
    res.status(400).send({ message: "Error ocuired while getting Bitcoin!" });
  }
};
const createBitcoin = async (req, res) => {
  try {
    const user = new Bitcoin({
      price: req.body.price,
    });

    user.save((error, user) => {
      if (error) {
        res.status(400).send({ message: "Can't add Bitcoin!" });
      }
      res.json(user);
    });
  } catch (error) {
    res
      .status(400)
      .send({ mesasge: "Something went wron while adding Bitcoin!" });
  }
};

module.exports = {
  getBitcoins,
  createBitcoin,
};
