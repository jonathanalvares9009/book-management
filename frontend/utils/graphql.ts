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
        title
        published_date
        average_rating
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

export const GET_AUTHORS = gql`
  query GetAuthors(
    $currentPage: Int!
    $currentLimit: Int!
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
