const db = require("../db/connection");

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
          status: 400,
          msg: `Review id ${review_id} not found!`,
        });
      }
      return result.rows[0];
    });
};

