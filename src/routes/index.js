const express = require("express");
const usersRouter = require("./users");
const itemsRouter = require("./items");
const cookbooksRouter = require("./cookbooks");

const router = express.Router();

router.use("/users", usersRouter);
router.use("/items", itemsRouter);
router.use("/cookbooks", cookbooksRouter);

module.exports = router;
