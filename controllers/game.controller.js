const {
  selectCategories,
  selectReviews,
  fetchReviewsByReviewId,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
  updateReview,
  selectUsers,
  selectReviewWithCommentCount,
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

exports.postReviewsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  insertCommentByReviewId(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReview(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};


