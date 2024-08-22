import { PageInfo } from "./pagination";

export interface Author {
  id?: string;
  name: string;
  biography: string;
  born_date: string;
}

export interface AuthorsData {
  authors: {
    authors: Author[];
    pageInfo: PageInfo;
  };
}
