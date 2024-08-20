const bookType = `
    type Book {
      id: ID!
      title: String!
      description: String
      published_date: String
      author: Author
      average_rating: Float
      review_count: Int
    }
`;

const authorType = `
    type Author {
      id: ID!
      name: String!
      biography: String
      born_date: String
      books: [Book]
    }
`;

const reviewType = `
    type Review {
      id: ID!
      book_id: ID!
      user: String!
      rating: Int!
      comment: String
      created_at: String!
    }
`;

const type = `
    ${bookType}
    ${authorType}
    ${reviewType}
`;

module.exports = type;
