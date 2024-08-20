const { Review } = require("../../models/mongodb");

const ReviewQuery = {
  reviews: ({ book_id }) => Review.find({ book_id }),
};

module.exports = { ...ReviewQuery };
