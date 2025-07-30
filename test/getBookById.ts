import { TypeCompiler } from "@sinclair/typebox/compiler";
import { IBook } from "../src/modules/book/types";
import fetch from "node-fetch";
import assert from "node:assert";
import { Book } from "../src/modules/book/schema";

export default async function getBookById(
  baseUrl: string,
  id: string
): Promise<IBook | null> {
  const res = await fetch(`${baseUrl}/books/${id}`);
  const json = await res.json();

  if (res.status !== 200) {
    return null;
  }

  assert.strict.ok(TypeCompiler.Compile(Book).Check(json));

  return json;
}
