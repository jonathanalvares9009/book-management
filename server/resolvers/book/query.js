const { Author, Book } = require("../../models");
const { Metadata } = require("../../models/mongodb");

const BookQuery = {
  books: async () => {
    const books = await Book.findAll({ include: Author });
    for (let book of books) {
      const metadata = await Metadata.findOne({ book_id: book.id });
      if (metadata) {
        book.average_rating = metadata.average_rating;
        book.review_count = metadata.review_count;
      }
    }
    return books;
  },
  book: async ({ id }) => {
    const book = await Book.findByPk(id, { include: Author });
    const metadata = await Metadata.findOne({ book_id: id });
    if (metadata) {
      book.average_rating = metadata.average_rating;
      book.review_count = metadata.review_count;
    }
    return book;
  },
};

module.exports = { ...BookQuery };
