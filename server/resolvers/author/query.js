const { Op } = require("sequelize");
const { Author, Book } = require("../../models");

const AuthorQuery = {
  authors: async ({ page = 1, limit = 10, filter = {} }) => {
    const offset = (page - 1) * limit;

    let whereClause = {};

    if (filter.name) {
      whereClause.name = { [Op.iLike]: `%${filter.name}%` };
    }

    if (filter.bornAfter) {
      whereClause.born_date = { [Op.gte]: filter.bornAfter };
    }

    if (filter.bornBefore) {
      whereClause.born_date = {
        ...whereClause.born_date,
        [Op.lte]: filter.bornBefore,
      };
    }

    const { count, rows: authors } = await Author.findAndCountAll({
      where: whereClause,
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
