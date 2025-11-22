const express = require("express");
const auth = require("../middlewares/auth");

const authRouter = require("./auth");
const usersRouter = require("./users");
const recipesRouter = require("./recipes");
const itemsRouter = require("./items");
const cookbooksRouter = require("./cookbooks");

const router = express.Router();

// PUBLIC ROUTES (NO AUTH)
router.use("/auth", authRouter);

// PROTECTED ROUTES (REQUIRE AUTH)
router.use("/users", auth, usersRouter);
router.use("/recipes", auth, recipesRouter);
router.use("/items", auth, itemsRouter);
router.use("/cookbooks", auth, cookbooksRouter);

module.exports = router;
