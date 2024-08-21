import { PageInfo } from "./pagination";

export interface Author {
  name: string;
  born_date: string;
}

export interface AuthorsData {
  authors: {
    authors: Author[];
    pageInfo: PageInfo;
  };
}
