const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");

const resolvers = require("./resolvers");
const schema = require("./schema");
const startServer = require("./utils/connection");

require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

startServer(app, PORT);
