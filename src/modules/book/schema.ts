import { Type } from "@sinclair/typebox";
import { ErrorNotFound } from "../error/schema";

export const BookReference = Type.Object({ id: Type.String() });

export const InputBook = Type.Object({
  title: Type.String(),
  author: Type.String(),
  publishedDate: Type.String(),
  genre: Type.String()
});

export const Book = Type.Composite([BookReference, InputBook]);

export const ErrorBookLimitReached = Type.Object({ error: Type.String() });

export const CreateBook = {
  description: "Create a book",
  body: InputBook,
  response: { 201: BookReference, 403: ErrorBookLimitReached }
};

export const UpdateBook = {
  description: "Update a book by id",
  params: BookReference,
  body: InputBook,
  response: { 201: BookReference, 404: ErrorNotFound }
};

export const DeleteBookResponse = BookReference;

export const DeleteBook = {
  description: "Delete a book by id",
  params: BookReference,
  response: { 201: DeleteBookResponse, 404: ErrorNotFound }
};

export const BookList = Type.Object({
  books: Type.Array(Book),
  total: Type.Number(),
  offset: Type.Number(),
  limit: Type.Number()
});

export const GetBook = {
  description: "Get a book by id",
  params: BookReference,
  response: { 201: Book, 404: ErrorNotFound }
};

export const GetBooks = {
  description: "Get a list of books",
  querystring: Type.Optional(
    Type.Object({
      offset: Type.Optional(Type.Number()),
      limit: Type.Optional(Type.Number())
    })
  ),
  response: { 201: BookList }
};
