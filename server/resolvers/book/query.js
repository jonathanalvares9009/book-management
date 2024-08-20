const { Author, Book } = require("../../models");
const { Metadata } = require("../../models/mongodb");

const BookQuery = {
  books: async ({ page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    const { count, rows: books } = await Book.findAndCountAll({
      include: Author,
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    for (let book of books) {
      const metadata = await Metadata.findOne({ book_id: book.id });
      if (metadata) {
        book.average_rating = metadata.average_rating;
        book.review_count = metadata.review_count;
      }
    }

    const totalPages = Math.ceil(count / limit);

    return {
      books,
      pageInfo: {
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        totalItems: count,
      },
    };
  },
  book: async ({ id }) => {
    const book = await Book.findByPk(id, { include: Author });
    if (!book) {
      throw new Error("Book not found");
    }
    const metadata = await Metadata.findOne({ book_id: id });
    if (metadata) {
      book.average_rating = metadata.average_rating;
      book.review_count = metadata.review_count;
    }
    return book;
  },
};

module.exports = { ...BookQuery };
