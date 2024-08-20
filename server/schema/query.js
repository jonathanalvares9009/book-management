const bookQuery = `
    books(page: Int, limit: Int): PaginatedBooks!
    book(id: ID!): Book
`;

const authorQuery = `
    authors(page: Int, limit: Int): PaginatedAuthors!
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
