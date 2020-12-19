const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Monster = require("../models/Monster");

// @route   GET api/monsters
// @desc    Get all monsters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const monsters = await Monster.find().sort({
      createdAt: -1,
    });
    res.json(monsters);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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

// @route   DELETE api/monsters/:id
// @desc    Delete monster
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    let monster = await Monster.findById(req.params.id);

    if (!monster) return res.status(404).json({ msg: "Monster not found." });

    await Monster.findByIdAndRemove(req.params.id);
    res.json({ msg: "Monster removed.", id: req.params.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
