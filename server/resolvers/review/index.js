const reviewQuery = require("./query");
const reviewMutation = require("./mutation");

module.exports = {
  ...reviewQuery,
  ...reviewMutation,
};
