const bookResolvers = require("./book");
const authorResolvers = require("./author");
const reviewResolvers = require("./review");

module.exports = {
  ...authorResolvers,
  ...bookResolvers,
  ...reviewResolvers,
};
