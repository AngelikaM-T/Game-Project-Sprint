const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewsByReviewId,
  getCommentsByReviewId,
  getEndPoints,
  postReviewsByReviewId,
  patchReview,
  getUsers,
  deleteCommentById,
} = require("./controllers/game.controller");

const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).send({ msg: "server up and running"})
})

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsByReviewId);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/users", getUsers);
app.get("/api", getEndPoints)

app.post("/api/reviews/:review_id/comments", postReviewsByReviewId);
app.patch("/api/reviews/:review_id", patchReview);
app.delete(`/api/comments/:comment_id`, deleteCommentById);

//custom errors
app.use((err, req, res, next) => {
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
