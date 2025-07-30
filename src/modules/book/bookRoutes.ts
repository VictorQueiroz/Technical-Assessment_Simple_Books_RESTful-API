import { BookRepository } from "./BookRepository";
import BookService from "./BookService";
import {
  CreateBook,
  DeleteBook,
  GetBook,
  GetBooks,
  UpdateBook
} from "./schema";
import { AppFastifyInstance } from "../../types";
import booksConfiguration from "./configuration";

export default function bookRoutes(fastify: AppFastifyInstance) {
  const booksRepository = new BookRepository();
  const booksService = new BookService(booksRepository);

  fastify.get("/books", { schema: GetBooks }, async (request, reply) => {
    const books = await booksService.list(
      request.query.offset,
      request.query.limit
    );
    return reply.status(200).send(books);
  });

  fastify.get("/books/:id", { schema: GetBook }, async (request, reply) => {
    const book = await booksService.get(request.params.id);
    if (book === null) {
      return reply.status(404).send({ error: "Book not found" });
    }
    return reply.status(200).send(book);
  });

  fastify.post("/books", { schema: CreateBook }, async (request, reply) => {
    if ((await booksService.count()) >= booksConfiguration.limit) {
      return reply
        .status(403)
        .send({
          error:
            `Limit reached. ` +
            `You can only create up to ${booksConfiguration.limit} books. ` +
            `Please delete one book to create a new one.`
        });
    }
    const book = await booksService.add(request.body);
    return reply.status(201).send({ id: book.id });
  });

  fastify.delete(
    "/books/:id",
    { schema: DeleteBook },
    async (request, reply) => {
      const book = await booksService.remove(request.params.id);
      if (book === null) {
        return reply.status(404).send({ error: "Book not found" });
      }
      return reply.status(201).send({ id: book.id });
    }
  );

  fastify.put("/books/:id", { schema: UpdateBook }, async (request, reply) => {
    const book = await booksService.modify(request.params.id, request.body);
    if (book === null) {
      return reply.status(404).send({ error: "Book not found" });
    }
    return reply.status(201).send({ id: book.id });
  });
}
