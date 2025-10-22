const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const usersController = require("../controllers/users");

router.get("/me", auth, usersController.getCurrentUser);
router.get("/", auth, usersController.getAllUsers);
router.get("/:id", auth, usersController.getUserById);
router.post("/", usersController.createUser);
router.put("/:id", auth, usersController.updateUser);
router.delete("/:id", auth, usersController.deleteUser);

module.exports = router;
