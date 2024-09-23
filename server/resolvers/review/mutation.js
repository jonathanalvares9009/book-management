const { Review, Metadata } = require("../../models/mongodb");

const ReviewMutation = {
  addReview: async ({ book_id, user, rating, comment }) => {
    const review = await Review.create({ book_id, user, rating, comment });
    const metadata = await Metadata.findOne({ book_id });
    if (metadata) {
      metadata.review_count += 1;
      metadata.average_rating =
        (metadata.average_rating * (metadata.review_count - 1) + rating) /
        metadata.review_count;
      await metadata.save();
    }
    return review;
  },
};

module.exports = { ...ReviewMutation };
