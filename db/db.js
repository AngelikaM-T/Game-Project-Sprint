const db = require("../db/connection");

exports.checkReviewExists = (review_id) => {
  return db
    .query(
      `
        SELECT * FROM reviews
        WHERE review_id = $1
        `,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comments with review id ${review_id} not found!`,
        });
      }
    });
};

exports.checkUsernameExists = (username) => {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE username = $1
    `,
      [username]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `${username} not found!`,
        });
      }
    });
};

exports.checkCategoryExists = (category) => {
  console.log(category)
  if (category === undefined) {
    return Promise.resolve("potato")
  }
  console.log("BYEEE")
  return db
    .query(
      `
    SELECT * FROM categories
    WHERE slug = $1;
    `,
      [category]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `${category} not found!`,
        });
      }
    });
};