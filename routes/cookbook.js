const express = require("express");
const authMiddleware = require("../middleware/auth");
const CookbookItem = require("../models/Cookbook");

const router = express.Router();

// Get all items for current user
router.get("/", authMiddleware, (req, res) => {
  CookbookItem.find({ userId: req.userId })
    .then((items) => res.json(items))
    .catch((err) => res.status(500).send(err.message));
});

// Add a new item
router.post("/", authMiddleware, (req, res) => {
  const { title, description, instructions, notes } = req.body;
  if (!title) return res.status(400).send("Title is required");

  const newItem = new CookbookItem({
    userId: req.userId,
    title,
    description,
    instructions,
    notes,
  });

  newItem
    .save()
    .then((item) => res.json(item))
    .catch((err) => res.status(500).send(err.message));
});

// Delete an item
router.delete("/:id", authMiddleware, (req, res) => {
  CookbookItem.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    .then((item) => {
      if (!item) return res.status(404).send("Item not found");
      res.send("Deleted successfully");
    })
    .catch((err) => res.status(500).send(err.message));
});

// Update an item
router.put("/:id", authMiddleware, (req, res) => {
  const { title, description, instructions, notes } = req.body;

  CookbookItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title, description, instructions, notes },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) return res.status(404).send("Item not found");
      res.json(updatedItem);
    })
    .catch((err) => res.status(500).send(err.message));
});

module.exports = router;
