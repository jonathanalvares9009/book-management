const { buildSchema } = require("graphql");
const type = require("./type");
const query = require("./query");
const mutation = require("./mutation");

const schema = buildSchema(`
    ${type}
    ${query}
    ${mutation}
`);

module.exports = schema;