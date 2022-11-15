const {
  selectCategories,
  selectReviews,
  fetchReviewsByReviewId,
  fetchCommentsByReviewId,
} = require("../models/game.models");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.send(categories);
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.send(reviews);
  });
};

exports.getReviewsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsByReviewId(review_id)
    .then((review) => {
      console.log(review)
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
