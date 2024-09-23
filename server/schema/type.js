const pageInfoType = `
  type PageInfo {
    currentPage: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalItems: Int!
  }
`;

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

const bookListType = `
  type PaginatedBooks {
    books: [Book!]!
    pageInfo: PageInfo!
  }
`;

const bookListFilterType = `
  input BookFilter {
    title: String
    authorName: String
    publishedAfter: String
    publishedBefore: String
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

const authorListType = `
  type PaginatedAuthors {
    authors: [Author!]!
    pageInfo: PageInfo!
  }
`;

const authorListFilterType = `
  input AuthorFilter {
    name: String
    bornAfter: String
    bornBefore: String
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
    ${pageInfoType}
    ${bookType}
    ${bookListType}
    ${bookListFilterType}
    ${authorType}
    ${authorListType}
    ${authorListFilterType}
    ${reviewType}
`;

module.exports = type;
