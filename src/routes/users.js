const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const usersController = require("../controllers/users");

router.get("/me", authMiddleware, usersController.getCurrentUser);
router.get("/", authMiddleware, usersController.getAllUsers);
router.get("/:id", authMiddleware, usersController.getUserById);
router.post("/", usersController.createUser);
router.put("/:id", authMiddleware, usersController.updateUser);
router.delete("/:id", authMiddleware, usersController.deleteUser);

module.exports = router;
