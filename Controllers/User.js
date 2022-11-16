const User = require("../Models/User");
const { v4: uuidv4 } = require("uuid");
const Bitcoin = require("../Models/Bitcoin");

const getUsers = (req, res) => {
  try {
    User.find((error, users) => {
      if (error) {
        res.status(400).send({ message: "Cannot get users!" });
      }
      res.json(users);
    });
  } catch (error) {
    res.status(400).send({ message: "Error ocuired while getting users!" });
  }
  User.find;
};

const createUser = (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      id: uuidv4(),
      bitcoinAmount: req.body.bitcoinAmount,
      usdBalance: req.body.usdBalance,
    });

    user.save((error, user) => {
      if (error) {
        res.status(400).send({ message: "Can't create user!" });
      }
      res.json(user);
    });
  } catch (error) {
    res
      .status(400)
      .send({ mesasge: "Something went wron while creating user!" });
  }
};

const updateUser = (req, res) => {
  try {
    User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          bitcoinAmount: req.body.bitcoinAmount,
          usdBalance: req.body.usdBalance,
        },
      },
      { new: true },
      (error, User) => {
        if (error) {
          res
            .status(400)
            .send({ message: `error while updating user!: ${error}` });
        } else {
          res.json(User);
        }
      }
    );
  } catch (error) {
    res.status(400).send({ message: `Can not update user: ${error}` });
  }
};

const updateUserAmount = async (req, res) => {
  const user = await User.find({ _id: req.params.userId });
  const bitcoin = await Bitcoin.find();
  try {
    if (req.body.action === "deposit") {
      User.findByIdAndUpdate(
        {
          _id: req.params.userId,
        },
        {
          $set: {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            bitcoinAmount: req.body.bitcoinAmount,
            usdBalance: user[0].usdBalance + req.body.amount,
          },
        },
        { new: true },
        (error, User) => {
          if (error) {
            res
              .status(400)
              .send({ message: `error while updating user amount!: ${error}` });
          } else {
            res.json(User);
          }
        }
      );
    }
    if (req.body.action === "withdraw") {
      if (user[0].usdBalance - req.body.amount < 0) {
        return res.status(500).send({ message: "Not Suffitient Funds!" });
      }
      User.findByIdAndUpdate(
        {
          _id: req.params.userId,
        },
        {
          $set: {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            bitcoinAmount: req.body.bitcoinAmount,
            usdBalance: user[0].usdBalance - req.body.amount,
          },
        },
        { new: true },
        (error, User) => {
          if (error) {
            res
              .status(400)
              .send({ message: `error while updating user amount!: ${error}` });
          } else {
            res.json(User);
          }
        }
      );
    } else {
    }
  } catch (error) {
    res.status(400).send({ message: `error while updating amount: ${error}` });
  }
};

const updateUserBitcoinAmount = async (req, res) => {
  const user = await User.find({ _id: req.params.userId });
  const bitcoin = await Bitcoin.find();
  try {
    if (req.body.action === "buy") {
      if (user[0].usdBalance - req.body.amount * bitcoin[0].price < 0) {
        return res
          .status(500)
          .send({ message: "You don't have enough amount to buy bitcoin!" });
      }
      User.findByIdAndUpdate(
        {
          _id: req.params.userId,
        },
        {
          $set: {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            bitcoinAmount: user[0].bitcoinAmount + req.body.amount,
            usdBalance: user[0].usdBalance - req.body.amount * bitcoin[0].price,
          },
        },
        { new: true },
        (error, User) => {
          if (error) {
            res
              .status(400)
              .send({ message: `error while updating user amount!: ${error}` });
          } else {
            res.json(User);
          }
        }
      );
    }
    if (req.body.action === "sell") {
      if (user[0].bitcoinAmount - req.body.amount < 0) {
        return res
          .status(500)
          .send({ message: "You don't have that much Bitcoin to sell!" });
      }
      User.findByIdAndUpdate(
        {
          _id: req.params.userId,
        },
        {
          $set: {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            bitcoinAmount: user[0].bitcoinAmount - req.body.amount,
            usdBalance: user[0].usdBalance + req.body.amount * bitcoin[0].price,
          },
        },
        { new: true },
        (error, User) => {
          if (error) {
            res
              .status(400)
              .send({ message: `error while updating user amount!: ${error}` });
          } else {
            res.json(User);
          }
        }
      );
    } else {
    }
  } catch (error) {
    res.status(400).send({ message: `error while updating amount: ${error}` });
  }
};

const getUserBalance = async (req, res) => {
  const user = await User.find({ _id: req.params.userId });
  const bitcoin = await Bitcoin.find();
  try {
    return res
      .status(200)
      .send(
        `user balance in USD is: ${
          user[0].usdBalance + bitcoin[0].price * user[0].bitcoinAmount
        }`
      );
  } catch (error) {
    res.status(400).send({ message: `can not find user: ${error}$` });
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
