import { PageInfo } from "./pagination";

export interface Book {
  id?: string;
  title: string;
  published_date: string;
  average_rating: number;
  author: {
    id: string;
  };
}

export interface BooksData {
  books: {
    books: Book[];
    pageInfo: PageInfo;
  };
}
