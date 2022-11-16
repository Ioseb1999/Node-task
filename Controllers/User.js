const User = require("../Models/User");
const { v4: uuidv4 } = require("uuid");
const Bitcoin = require("../Models/Bitcoin");

const userAndBitcoin = async (id) => {
  try {
    const data = await Promise.all([User.find({ _id: id }), Bitcoin.find()]);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find();

    return res.status(200).send(user);
  } catch (error) {
    res.status(422).send({ message: "Can not get Users!" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      id: uuidv4()
    });

    const createdUser = await user.save();
    return res.status(200).send(createdUser);
  } catch (error) {
    res.status(403).send({ mesasge: "can not create user!" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email
        },
      },
      { new: true }
    );
    return res.status(200).send(updatedUser);
  } catch (error) {
    res.status(204).send({ message: `Can not update user!` });
  }
};

const updateUserAmount = async (req, res) => {
  try {
    const [user, bitcoin] = await userAndBitcoin(req.params.userId);
    const returnedValue = (actionType) => {
      if (actionType === "deposit") {
        return {
          bitcoinAmount: req.body.bitcoinAmount,
          usdBalance: user[0].usdBalance + req.body.amount,
        };
      }
      if (actionType === "withdraw") {
        if (user[0].usdBalance - req.body.amount < 0) {
          return res.status(422).send({ message: "Not Suffitient Funds!" });
        }
        return {
          bitcoinAmount: req.body.bitcoinAmount,
          usdBalance: user[0].usdBalance - req.body.amount,
        };
      }
    };
    const updatedAmount = await User.findByIdAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $set: returnedValue(req.body.action),
      },
      { new: true }
    );

    return res.status(200).send(updatedAmount);
  } catch (error) {
    res.status(204).send({ message: `error while updating amount` });
  }
};

const updateUserBitcoinAmount = async (req, res) => {
  try {
    const [user, bitcoin] = await userAndBitcoin(req.params.userId);

    const returnedValue = (actionType) => {
      if (actionType === "buy") {
        if (user[0].usdBalance - req.body.amount * bitcoin[0].price < 0) {
          return res
            .status(422)
            .send({ message: "You don't have enough amount to buy bitcoin!" });
        }
        return {
          bitcoinAmount: user[0].bitcoinAmount + req.body.amount,
          usdBalance: user[0].usdBalance - req.body.amount * bitcoin[0].price,
        };
      }
      if (actionType === "sell") {
        if (user[0].bitcoinAmount - req.body.amount < 0) {
          return res
            .status(422)
            .send({ message: "You don't have that much Bitcoin to sell!" });
        }
        return {
          bitcoinAmount: user[0].bitcoinAmount - req.body.amount,
          usdBalance: user[0].usdBalance + req.body.amount * bitcoin[0].price,
        };
      }
    };

    const updatedBitcoin = await User.findByIdAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $set: returnedValue(req.body.action),
      },
      { new: true }
    );

    return res.status(200).send(updatedBitcoin);
  } catch (error) {
    res.status(204).send({ message: `error while updating amount: ${error}` });
  }
};

const getUserBalance = async (req, res) => {
  try {
    const [user, bitcoin] = await userAndBitcoin(req.params.userId);
    return res
      .status(200)
      .send(
        `user balance in USD is: ${
          user[0].usdBalance + bitcoin[0].price * user[0].bitcoinAmount
        }`
      );
  } catch (error) {
    res.status(404).send({ message: `can not find user: ${error}$` });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserAmount,
  updateUserBitcoinAmount,
  getUserBalance,
};
