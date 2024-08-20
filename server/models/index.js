const { Sequelize } = require("sequelize");
const BookModel = require("./book");
const AuthorModel = require("./author");
require("dotenv").config({
  path: "../.env",
});

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: "postgres",
});

const Book = BookModel(sequelize);
const Author = AuthorModel(sequelize);

// Associations
Author.hasMany(Book);
Book.belongsTo(Author);

module.exports = {
  sequelize,
  Book,
  Author,
};
