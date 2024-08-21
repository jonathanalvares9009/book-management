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
