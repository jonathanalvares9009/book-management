const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const { sequelize, Book, Author } = require("./models");
const mongoose = require("mongoose");
const { Review, Metadata } = require("./models/mongodb");
const resolvers = require("./resolvers");
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
    rootValue: resolvers,
    graphiql: true,
  })
);

startServer();
