const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Monster = require("../models/Monster");

// @route   POST api/monsters
// @desc    Create a monster
// @access  Public
router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      let monster = await Monster.findOne({ email });

      if (monster)
        return res.status(400).json({ msg: "Monster already exists." });

      monster = new Monster({ name, email });
      await monster.save();
      res.status(200).send(monster);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
