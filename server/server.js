const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const { sequelize } = require("./models");
const mongoose = require("mongoose");
const resolvers = require("./resolvers");
const schema = require("./schema");
require("dotenv").config();

const app = express();
const port = 4000;

app.use(cors());

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
