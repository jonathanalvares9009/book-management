const { Author, Book } = require("../../models");

const AuthorQuery = {
  authors: async ({ page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    const { count, rows: authors } = await Author.findAndCountAll({
      include: Book,
      limit: limit,
      offset: offset,
      order: [["id", "ASC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      authors,
      pageInfo: {
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        totalItems: count,
      },
    };
  },
  author: async ({ id }) => {
    const author = await Author.findByPk(id, { include: Book });
    if (!author) {
      throw new Error("Author not found");
    }
    return author;
  },
};

module.exports = { ...AuthorQuery };
