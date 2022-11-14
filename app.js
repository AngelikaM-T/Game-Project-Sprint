const express = require("express");
const app = express();
const { getCategories, getReviews } = require("./controllers/game.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found!" });
  });

module.exports = app;
