const express = require("express");
const app = express();
const { getCategories } = require("./controllers/game.controller");

app.get("/api/categories", getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

module.exports = app;
