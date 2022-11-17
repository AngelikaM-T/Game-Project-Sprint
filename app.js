const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewsByReviewId,
  getCommentsByReviewId,
  postReviewsByReviewId,
  patchReview,
} = require("./controllers/game.controller");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsByReviewId);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postReviewsByReviewId);
app.patch("/api/reviews/:review_id", patchReview);

//custom errors
app.use((err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "invalid query!" });
  }
  next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

module.exports = app;
