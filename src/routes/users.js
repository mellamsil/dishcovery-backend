const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

// Add this empty line before starting route definitions

router.get("/me", auth, getCurrentUser);
router.get("/", auth, getAllUsers);
router.get("/:id", auth, getUserById);

router.post("/", createUser);

router.put("/:id", auth, updateUser);
router.put("/me", auth, updateUser);

router.delete("/:id", auth, deleteUser);

module.exports = router;
