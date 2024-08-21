import { PageInfo } from "./pagination";

export interface Book {
  title: string;
  published_date: string;
  average_rating: number;
}

export interface BooksData {
  books: {
    books: Book[];
    pageInfo: PageInfo;
  };
}
