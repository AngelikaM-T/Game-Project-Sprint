const db = require("../db/connection");
const {
  checkReviewExists,
  checkUsernameExists,
  checkCategoryExists,
  checkCommentExists,
} = require("../db/db");

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

exports.selectReviews = (sort_by = "created_at", order = "DESC", category) => {
  const validSortQueries = [
    "created_at",
    "votes",
    "title",
    "owner",
    "designer",
    "comment_count",
  ];
  const validOrderQueries = ["ASC", "DESC"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }
  if (!validOrderQueries.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  return checkCategoryExists(category).then(() => {
    const categoryValues = [];
    let queryStr = `SELECT 
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
                LEFT JOIN comments
                ON reviews.review_id = comments.review_id`;

    if (category) {
      queryStr += ` WHERE reviews.category = $1`;
      categoryValues.push(category);
    }

    queryStr += ` GROUP BY reviews.review_id`;

    queryStr += ` ORDER BY ${sort_by} ${order}`;

    return db.query(queryStr, categoryValues).then((result) => {
      return result.rows;
    });
  });
};

exports.fetchReviewsByReviewId = (review_id) => {
  return db
    .query(
      `
      SELECT 
        reviews.*,
        COUNT(comments.review_id)::INT AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
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

exports.selectUsers = () => {
  return db
    .query(
      `    
      SELECT  *
      FROM users;
      `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.deleteComment = (comment_id) => {
  return checkCommentExists(comment_id).then(() => {
    return db
      .query(
        `
      DELETE FROM comments 
      WHERE comment_id = $1
      RETURNING *;
      `,
        [comment_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};
