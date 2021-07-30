const express = require("express");
const router = express.Router();
const userModel = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:searchText", authMiddleware, async (req, res) => {
  const { searchText } = req.params;

  if (searchText.length === 0) {
    return;
  }

  try {
    const serchPattern = new RegExp(`^${searchText}`);

    const results = await userModel.find({
      username: { $regex: serchPattern, $options: "i" },
    });

    return res.json(results);
  } catch (error) {
    return res.status(500).json("server error");
  }
});

module.exports = router;
