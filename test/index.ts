import test, { afterEach } from "node:test";
import assert from "node:assert";
import fetch from "node-fetch";
import {
  BookList,
  BookReference,
  DeleteBookResponse,
  ErrorBookLimitReached
} from "../src/modules/book/schema";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import createBook from "./createBook";
import getBookById from "./getBookById";
import configuration from "../src/configuration.secret";
import booksConfiguration from "../src/modules/book/configuration";
import listBooks from "./listBooks";

const baseUrl = `http://${configuration.listenOptions.host}:${configuration.listenOptions.port}`;

const sampleBook = Object.seal(
  Object.freeze({
    title: "The Pragmatic Programmer",
    author: "Andy Hunt",
    publishedDate: "1999-10-30",
    genre: "Programming"
  })
);

afterEach(async () => {
  // Delete all books
  let startOffset = 0;
  const limit = 10;
  const bookCount = (await listBooks(baseUrl, startOffset, limit)).total;

  while (startOffset < bookCount) {
    const bookList = await listBooks(baseUrl, startOffset, limit);
    for (const book of bookList.books) {
      await fetch(`${baseUrl}/books/${book.id}`, { method: "DELETE" });
    }
    startOffset = Math.min(startOffset + limit, bookCount);
  }
});

test("POST /books - should create a new book", async () => {
  const newBook = await createBook(baseUrl, sampleBook);

  assert.strict.ok(TypeCompiler.Compile(BookReference).Check(newBook));
  assert.strict.strictEqual(newBook.title, sampleBook.title);
  assert.strict.strictEqual(newBook.author, sampleBook.author);
  assert.strict.strictEqual(newBook.publishedDate, sampleBook.publishedDate);
  assert.strict.strictEqual(newBook.genre, sampleBook.genre);
});

test("POST /books - should only allow books to be created up to a certain limit", async () => {
  assert.strict.ok(
    booksConfiguration.limit > 0,
    `Book count limit must be greater than 0`
  );

  for (let i = 0; i < booksConfiguration.limit; i++) {
    await createBook(baseUrl, sampleBook);
  }

  const createBookResponse = await fetch(`${baseUrl}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sampleBook)
  });

  assert.strict.strictEqual(createBookResponse.status, 403);
  const json = await createBookResponse.json();

  assert.strict.ok(TypeCompiler.Compile(ErrorBookLimitReached).Check(json));
  assert.strict.match(json.error, /Limit reached/);
  assert.strict.match(json.error, new RegExp(`${booksConfiguration.limit}`));
});

test("GET /books - should list all books", async () => {
  const res = await fetch(`${baseUrl}/books?offset=0&limit=10`);
  const json = await res.json();
  assert.strict.strictEqual(res.status, 200);
  assert.strict.ok(TypeCompiler.Compile(BookList).Check(json));
  assert.strict.ok(Array.isArray(json.books));
  assert.strict.strictEqual(typeof json.total, "number");
});

test("GET /books/:id - should retrieve a book by ID", async () => {
  const createdBook = await createBook(baseUrl, sampleBook);
  const res = await fetch(`${baseUrl}/books/${createdBook.id}`);
  const json = await res.json();
  assert.strict.equal(res.status, 200);
  assert.strict.ok(TypeCompiler.Compile(BookReference).Check(json));
  assert.strict.strictEqual(json.id, createdBook.id);
});

test("PUT /books/:id - should update a book by ID", async () => {
  const createdBook = await createBook(baseUrl, sampleBook);
  const res = await fetch(`${baseUrl}/books/${createdBook.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...sampleBook,
      title: "The Pragmatic Programmer (Updated)"
    })
  });

  const updatedBook = await getBookById(baseUrl, createdBook.id);

  assert.strict.strictEqual(res.status, 201);
  assert.strict.ok(updatedBook !== null);
  assert.strict.strictEqual(
    updatedBook.title,
    "The Pragmatic Programmer (Updated)"
  );
  assert.strict.strictEqual(updatedBook.author, sampleBook.author);
  assert.strict.strictEqual(
    updatedBook.publishedDate,
    sampleBook.publishedDate
  );
  assert.strict.strictEqual(updatedBook.genre, sampleBook.genre);
});

test("DELETE /books/:id - should delete a book by ID", async () => {
  const createdBook = await createBook(baseUrl, sampleBook);
  const res = await fetch(`${baseUrl}/books/${createdBook.id}`, {
    method: "DELETE"
  });
  const json = await res.json();
  assert.strict.strictEqual(res.status, 201);
  assert.strict.ok(TypeCompiler.Compile(DeleteBookResponse).Check(json));
  assert.strict.strictEqual(json.id, createdBook.id);

  const deletedBook = await getBookById(baseUrl, createdBook.id);
  assert.strict.strictEqual(deletedBook, null);
});
