const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewsByReviewId,
  getCommentsByReviewId,
  postReviewsByReviewId,
} = require("./controllers/game.controller");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsByReviewId);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postReviewsByReviewId);

//custom errors
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid query!" });
  }
  next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

module.exports = app;
