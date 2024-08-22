import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query GetBooks(
    $currentPage: Int!
    $currentLimit: Int!
    $titleFilter: String
    $startDate: String
    $endDate: String
  ) {
    books(
      page: $currentPage
      limit: $currentLimit
      filter: {
        title: $titleFilter
        publishedAfter: $startDate
        publishedBefore: $endDate
      }
    ) {
      books {
        id
        title
        description
        published_date
        average_rating
        author {
          id
        }
      }
      pageInfo {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
        totalItems
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $description: String!
    $publishedDate: String!
    $authorId: ID
  ) {
    addBook(
      title: $title
      description: $description
      published_date: $publishedDate
      author_id: $authorId
    ) {
      title
      author {
        id
        name
      }
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation updateBook(
    $id: ID!
    $title: String!
    $description: String!
    $publishedDate: String!
    $authorId: ID
  ) {
    updateBook(
      id: $id
      title: $title
      description: $description
      published_date: $publishedDate
      author_id: $authorId
    ) {
      title
      author {
        id
      }
    }
  }
`;

export const GET_AUTHORS = gql`
  query GetAuthors(
    $currentPage: Int
    $currentLimit: Int
    $nameFilter: String
    $startDate: String
    $endDate: String
  ) {
    authors(
      page: $currentPage
      limit: $currentLimit
      filter: { name: $nameFilter, bornAfter: $startDate, bornBefore: $endDate }
    ) {
      authors {
        name
        born_date
        biography
        id
      }
      pageInfo {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
        totalItems
      }
    }
  }
`;

export const ADD_AUTHOR = gql`
  mutation addAuthor($name: String!, $biography: String!, $bornDate: String!) {
    addAuthor(name: $name, biography: $biography, born_date: $bornDate) {
      name
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor(
    $id: ID!
    $name: String!
    $biography: String!
    $bornDate: String!
  ) {
    updateAuthor(
      id: $id
      name: $name
      biography: $biography
      born_date: $bornDate
    ) {
      name
    }
  }
`;
