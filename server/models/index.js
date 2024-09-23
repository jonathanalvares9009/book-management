const { Sequelize } = require("sequelize");
const BookModel = require("./book");
const AuthorModel = require("./author");
require("dotenv").config({
  path: "../.env",
});

const sequelize = new Sequelize(process.env.POSTGRES_URI);

async function createDatabaseIfNotExists() {
  try {
    // Check if the database exists
    const [results, metadata] = await sequelize.query(
      "SELECT 1 FROM pg_database WHERE datname = 'booksdb'"
    );

    if (results.length === 0) {
      // Database doesn't exist, so create it
      await sequelize.query("CREATE DATABASE booksdb");
      console.log("Database 'booksdb' created successfully");
    } else {
      console.log("Database 'booksdb' already exists");
    }
  } catch (error) {
    console.error("Error checking/creating database:", error);
  }
}

createDatabaseIfNotExists();

const Book = BookModel(sequelize);
const Author = AuthorModel(sequelize);

// Associations
Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id", as: "author" });

module.exports = {
  sequelize,
  Book,
  Author,
};
