const {
  selectCategories,
  selectReviews,
  fetchReviewsByReviewId,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
  updateReview,
  selectUsers,
  deleteComment,
} = require("../models/game.models");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.send(categories);
  });
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  selectReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch((err) => {
      next(err);
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then((comment) => {
      res.sendStatus(204);
    })
    .catch(next);
};
