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
        ALTER TABLE reviews
        ADD COLUMN comment_count INT NOT NULL;

          `
    )
    .then((result) => {
      console.log(result.rows);
    });
};
