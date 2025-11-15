const express = require("express");

const usersRouter = require("./users");
const itemsRouter = require("./items");
const cookbooksRouter = require("./cookbooks");
const authRouter = require("./auth");

const router = express.Router();

// Authentication routes (signin / signup)
router.use("/auth", authRouter);

router.use("/users", usersRouter);
router.use("/items", itemsRouter);
router.use("/cookbooks", cookbooksRouter);

module.exports = router;
