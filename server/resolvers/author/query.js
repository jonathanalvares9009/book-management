const { Author, Book } = require("../../models");

const AuthorQuery = {
  authors: () => Author.findAll({ include: Book }),
  author: ({ id }) => Author.findByPk(id, { include: Book }),
};

module.exports = { ...AuthorQuery };
