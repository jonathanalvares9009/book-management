const { Op } = require("sequelize");
const { Author, Book } = require("../../models");
const { Metadata } = require("../../models/mongodb");

const BookQuery = {
  books: async ({ page = 1, limit = 10, filter = {} }) => {
    const offset = (page - 1) * limit;

    let whereClause = {};
    let authorWhereClause = {};

    if (filter.title) {
      whereClause.title = { [Op.iLike]: `%${filter.title}%` };
    }

    if (filter.authorName) {
      authorWhereClause.name = { [Op.iLike]: `%${filter.authorName}%` };
    }

    if (filter.publishedAfter) {
      whereClause.published_date = { [Op.gte]: filter.publishedAfter };
    }

    if (filter.publishedBefore) {
      whereClause.published_date = {
        ...whereClause.published_date,
        [Op.lte]: filter.publishedBefore,
      };
    }

    const { count, rows: books } = await Book.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Author,
          as: "author",
          where: Object.keys(authorWhereClause).length
            ? authorWhereClause
            : undefined,
        },
      ],
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
      distinct: true, // This ensures correct count when including associations
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
    const book = await Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: "author", // Ensure this alias matches the one used in your model associations
        },
      ],
    });
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
