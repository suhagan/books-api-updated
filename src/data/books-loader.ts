// Loads books.json with Bun.file and stores them in memory
// Why: read once, reuse everywhere (controllers + tests)
/*
import { store } from "./store";
import type { Book } from "../types";

export async function loadBooksOnce(): Promise<void> {
  // If books are already loaded, do nothing
  if (store.books.length > 0) {
    return;
  }

  const file = Bun.file(new URL("../../books.json", import.meta.url));

  if (!(await file.exists())) {
    throw new Error("books.json not found in project root.");
  }

  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error("books.json must be an array.");
  }

  store.books = parsed.map((b) => ({
    id: String(b.id),
    title: String(b.title),
    author: String(b.author),
    year: String(b.year),
  })) as Book[];
}
*/