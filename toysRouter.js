const express = require("express");
const router = express.Router();
const Toy = require("./toyModel.js");
const auth = require("./authMiddleware");

router.get("/", async (req, res) => {
  try {
    const toys = await Toy.find();

    res.json(toys);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const newToy = new Toy({
      name: req.body.name,
      info: req.body.info,
      category: req.body.category,
      img_url: req.body.img_url,
      price: req.body.price,
      user_id: req.user.userId,
    });

    const savedToy = await newToy.save();
    res.status(201).json(savedToy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const toyId = req.params.id;

    const toy = await Toy.findById(toyId);
    if (!toy) {
      return res.status(404).json({ error: "Toy not found" });
    }

    if (toy.user_id !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to edit this toy" });
    }

    const updatedToy = await Toy.findByIdAndUpdate(
      toyId,
      {
        $set: {
          name: req.body.name,
          info: req.body.info,
          category: req.body.category,
          img_url: req.body.img_url,
          price: req.body.price,
        },
      },
      { new: true }
    );

    res.json(updatedToy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const toyId = req.params.id;
    const toy = await Toy.findById(toyId);
    if (!toy) {
      return res.status(404).json({ error: "Toy not found" });
    }

    if (toy.user_id !== req.user.userId && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this toy" });
    }

    await Toy.findByIdAndDelete(toyId);
    res.json({ msg: "Toy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
