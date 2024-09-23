const { Author, Book } = require("../../models");

const AuthorMutation = {
  addAuthor: ({ name, biography, born_date }) =>
    Author.create({ name, biography, born_date }),
  updateAuthor: async ({ id, ...updates }) => {
    await Author.update(updates, { where: { id } });
    return Author.findByPk(id, { include: Book });
  },
  deleteAuthor: async ({ id }) => {
    const deleted = await Author.destroy({ where: { id } });
    return deleted > 0;
  },
};

module.exports = { ...AuthorMutation };
