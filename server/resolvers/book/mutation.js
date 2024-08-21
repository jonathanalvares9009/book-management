const { Author, Book } = require("../../models");
const { Metadata, Review } = require("../../models/mongodb");

const BookMutation = {
  addBook: async ({ title, description, published_date, author_id }) => {
    const book = await Book.create({
      title,
      description,
      published_date,
      author_id: author_id || null,
    });
    await Metadata.create({ book_id: book.id });
    return book;
  },
  updateBook: async ({ id, ...updates }) => {
    await Book.update(updates, { where: { id } });
    return Book.findByPk(id, { include: Author });
  },
  deleteBook: async ({ id }) => {
    const deleted = await Book.destroy({ where: { id } });
    await Metadata.deleteOne({ book_id: id });
    await Review.deleteMany({ book_id: id });
    return deleted > 0;
  },
};

module.exports = { ...BookMutation };
