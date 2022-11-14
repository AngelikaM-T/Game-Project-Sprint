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
          SELECT * FROM reviews;
          
          `
      )
      .then((result) => {
        console.log(result.rows)
      });
  };
