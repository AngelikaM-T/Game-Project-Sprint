const db = require("../db/connection");
const { checkReviewExists, checkUsernameExists } = require("../db/db");

exports.selectCategories = () => {
  return db
    .query(
      `
        SELECT * FROM categories;
        
        `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviews = () => {
  return db
    .query(
      `
        SELECT 
        reviews.owner,
        reviews.title,
        reviews.review_id,
        reviews.category,
        reviews.review_img_url,
        reviews.created_at,
        reviews.votes,
        reviews.designer,
        COUNT(comments.review_id) AS comment_count
        FROM reviews
        JOIN comments
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY created_at DESC
          `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchReviewsByReviewId = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM reviews
    WHERE review_id = $1
    `,
      [review_id]
    )
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `Review id ${review_id} not found!`,
        });
      }
      return result.rows[0];
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return checkReviewExists(review_id)
    .then(() => {
      return db.query(
        `
      SELECT 
      comment_id, votes, created_at, author, body, review_id
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC
      `,
        [review_id]
      );
    })

    .then((result) => {
      return result.rows;
    });
};

exports.insertCommentByReviewId = (review_id, username, body) => {
  if (!body || !username) {
    return Promise.reject({
      status: 400,
      msg: "invalid request",
    });
  }
  if (typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "body data type incorrect - needs to be a string",
    });
  }
  return checkReviewExists(review_id)
    .then(() => {
      return checkUsernameExists(username);
    })
    .then(() => {
      console.log("in the model");
      return db.query(
        `
        INSERT INTO comments
        (body, review_id, author)
        VALUES
        ($1, $2, $3)
        RETURNING *
      `,
        [body, review_id, username]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateReview = (review_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "invalid request",
    });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "update failed, increment data type incorrect",
    });
  }
  return checkReviewExists(review_id)
    .then(() => {
      return db.query(
        `
    UPDATE reviews
    SET votes = votes + $2
    WHERE review_id = $1
    RETURNING *
    `,
        [review_id, inc_votes]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};
