const bookQuery = require("./query");
const bookMutation = require("./mutation");

module.exports = {
  ...bookQuery,
  ...bookMutation,
};
