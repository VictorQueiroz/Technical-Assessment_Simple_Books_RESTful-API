import { BookReference } from "../src/modules/book/schema";
import assert from "node:assert";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { IInputBook } from "../src/modules/book/types";

/**
 * Creates a book using the Fastify API at the given baseUrl.
 *
 * @param baseUrl The base URL of the Fastify API.
 * @param book The book to create.
 *
 * @returns A promise that resolves with the created book.
 */
export default async function createBook(baseUrl: string, book: IInputBook) {
  const res = await fetch(`${baseUrl}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });

  const json = await res.json();
  assert.strict.strictEqual(res.status, 201, res.statusText);
  assert.strict.ok(TypeCompiler.Compile(BookReference).Check(json));
  assert.strict.ok(json.id);

  return { id: json.id, ...book };
}
