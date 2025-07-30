import { Static } from "@sinclair/typebox";
import { Book, InputBook } from "./schema";

export type IBook = Static<typeof Book>;

export type IInputBook = Static<typeof InputBook>;

export interface IBookList {
  books: IBook[];
  offset: number;
  limit: number;
  total: number;
}
