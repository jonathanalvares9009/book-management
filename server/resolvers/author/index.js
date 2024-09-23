const authorQuery = require("./query");
const authorMutation = require("./mutation");

module.exports = {
  ...authorQuery,
  ...authorMutation,
};
