const { getBitcoins, createBitcoin } = require("./Controllers/Bitcoin");
const { getUsers, createUser, updateUser, updateUserAmount, updateUserBitcoinAmount, getUserBalance } = require("./Controllers/User");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Welcome to Node test task about Bitcoin!");
});

router.get("/users", getUsers);
router.get("/bitcoin", getBitcoins);
router.post("/users", createUser);
router.post("/add-bitcoin", createBitcoin);
router.put("/users/:id", updateUser)
router.post("/users/:userId/usd", updateUserAmount)
router.post("/users/:userId/bitcoins", updateUserBitcoinAmount)
router.get("/users/:userId/balance", getUserBalance)

module.exports = router;
