import assert from "node:assert";
import fetch from "node-fetch";
import { BookList } from "../src/modules/book/schema";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { IBookList } from "../src/modules/book/types";

export default async function listBooks(
  baseUrl: string,
  offset: number,
  limit: number
): Promise<IBookList> {
  const res = await fetch(`${baseUrl}/books?offset=${offset}&limit=${limit}`);

  assert.strict.equal(res.status, 200);

  const json = await res.json();

  assert.strict.ok(TypeCompiler.Compile(BookList).Check(json));

  return json;
}
