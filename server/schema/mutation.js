const bookMutation = `
    addBook(title: String!, description: String, published_date: String, author_id: ID!): Book
    updateBook(id: ID!, title: String, description: String, published_date: String, author_id: ID): Book
    deleteBook(id: ID!): Boolean
`;

const authorMutation = `
    addAuthor(name: String!, biography: String, born_date: String): Author
    updateAuthor(id: ID!, name: String, biography: String, born_date: String): Author
    deleteAuthor(id: ID!): Boolean
`;

const reviewMutation = `
    addReview(book_id: ID!, user: String!, rating: Int!, comment: String): Review
`;

const mutationSchema = `
    type Mutation {
        ${bookMutation}
        ${authorMutation}
        ${reviewMutation}
    }
`;

module.exports = mutationSchema;
