const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const { sequelize, Book, Author } = require("./models");
const mongoose = require("mongoose");
const { Review, Metadata } = require("./models/mongodb");
require("dotenv").config();

const app = express();
const port = 4000;

app.use(cors());

// GraphQL schema (update to include new types and fields)
const schema = buildSchema(`
    type Book {
      id: ID!
      title: String!
      description: String
      published_date: String
      author: Author
      average_rating: Float
      review_count: Int
    }
  
    type Author {
      id: ID!
      name: String!
      biography: String
      born_date: String
      books: [Book]
    }
  
    type Review {
      id: ID!
      book_id: ID!
      user: String!
      rating: Int!
      comment: String
      created_at: String!
    }
  
    type Query {
      books: [Book]
      book(id: ID!): Book
      authors: [Author]
      author(id: ID!): Author
      reviews(book_id: ID!): [Review]
    }
  
    type Mutation {
      addBook(title: String!, description: String, published_date: String, author_id: ID!): Book
      updateBook(id: ID!, title: String, description: String, published_date: String, author_id: ID): Book
      deleteBook(id: ID!): Boolean
  
      addAuthor(name: String!, biography: String, born_date: String): Author
      updateAuthor(id: ID!, name: String, biography: String, born_date: String): Author
      deleteAuthor(id: ID!): Boolean
  
      addReview(book_id: ID!, user: String!, rating: Int!, comment: String): Review
    }
  `);

// Resolvers (update to include new resolvers)
const root = {
  books: async () => {
    const books = await Book.findAll({ include: Author });
    for (let book of books) {
      const metadata = await Metadata.findOne({ book_id: book.id });
      if (metadata) {
        book.average_rating = metadata.average_rating;
        book.review_count = metadata.review_count;
      }
    }
    return books;
  },
  book: async ({ id }) => {
    const book = await Book.findByPk(id, { include: Author });
    const metadata = await Metadata.findOne({ book_id: id });
    if (metadata) {
      book.average_rating = metadata.average_rating;
      book.review_count = metadata.review_count;
    }
    return book;
  },
  authors: () => Author.findAll({ include: Book }),
  author: ({ id }) => Author.findByPk(id, { include: Book }),
  reviews: ({ book_id }) => Review.find({ book_id }),

  addBook: async ({ title, description, published_date, author_id }) => {
    const book = await Book.create({
      title,
      description,
      published_date,
      author_id,
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

  addReview: async ({ book_id, user, rating, comment }) => {
    const review = await Review.create({ book_id, user, rating, comment });
    const metadata = await Metadata.findOne({ book_id });
    if (metadata) {
      metadata.review_count += 1;
      metadata.average_rating =
        (metadata.average_rating * (metadata.review_count - 1) + rating) /
        metadata.review_count;
      await metadata.save();
    }
    return review;
  },
};

const startServer = async () => {
  try {
    // Wait for PostgreSQL to be ready
    await sequelize.authenticate();
    console.log("PostgreSQL connection has been established successfully.");

    // Sync Sequelize models
    await sequelize.sync();
    console.log("PostgreSQL models synced successfully.");

    // Wait for MongoDB to be ready
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection has been established successfully.");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

startServer();
