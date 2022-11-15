const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewsByReviewId,
} = require("./controllers/game.controller");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsByReviewId);


//custom errors
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});



app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint Not found!" });
});

module.exports = app;
