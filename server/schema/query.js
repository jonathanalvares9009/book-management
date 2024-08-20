const bookQuery = `
    books: [Book]
    book(id: ID!): Book
`;

const authorQuery = `
    authors: [Author]
    author(id: ID!): Author
`;

const reviewQuery = `
    reviews(book_id: ID!): [Review]
`;

const querySchema = `
    type Query {
        ${bookQuery}
        ${authorQuery}
        ${reviewQuery}
    }
`;

module.exports = querySchema;
