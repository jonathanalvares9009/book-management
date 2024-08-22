const { Author, Book } = require("../../models");
const { Metadata, Review } = require("../../models/mongodb");
const { sequelize } = require("../../models");

const BookMutation = {
  addBook: async ({ title, description, published_date, author_id }) => {
    const sequelizeTransaction = await sequelize.transaction();

    try {
      if (author_id) {
        const authorExists = await Author.findByPk(author_id, {
          transaction: sequelizeTransaction,
        });
        if (!authorExists) {
          throw new Error(`Author with id ${author_id} does not exist`);
        }
      }

      const book = await Book.create(
        {
          title,
          description,
          published_date,
          author_id: author_id,
        },
        { transaction: sequelizeTransaction }
      );

      // Create the metadata using Mongoose
      // await Metadata.create({
      //   book_id: book.id,
      //   average_rating: 0,
      //   review_count: 0,
      // });

      const bookWithAuthor = await Book.findByPk(book.id, {
        include: {
          model: Author,
          as: "author",
        },
        transaction: sequelizeTransaction,
      });

      await sequelizeTransaction.commit();

      return bookWithAuthor;
    } catch (error) {
      await sequelizeTransaction.rollback();
      console.error("Error adding book:", error);
      throw error;
    }
  },
  updateBook: async ({ id, ...updates }) => {
    await Book.update(updates, { where: { id } });
    return Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: "author",
        },
      ],
    });
  },
  deleteBook: async ({ id }) => {
    const deleted = await Book.destroy({ where: { id } });
    await Metadata.deleteOne({ book_id: id });
    await Review.deleteMany({ book_id: id });
    return deleted > 0;
  },
};

module.exports = { ...BookMutation };
