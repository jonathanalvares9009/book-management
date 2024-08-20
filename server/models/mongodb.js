const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ReviewSchema = new mongoose.Schema({
  book_id: { type: Number, required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  created_at: { type: Date, default: Date.now },
});

const MetadataSchema = new mongoose.Schema({
  book_id: { type: Number, required: true, unique: true },
  average_rating: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
});

const Review = mongoose.model("Review", ReviewSchema);
const Metadata = mongoose.model("Metadata", MetadataSchema);

module.exports = { Review, Metadata };
