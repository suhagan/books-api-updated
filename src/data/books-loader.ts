// Loads books.json with Bun.file and puts into store.books
// Why: to read from books.json and keep in memory.

import { store } from "./store";
import type { Book } from "../types";

export async function loadBooksOnce(): Promise<void> {
    // if already loaded, do not load again 
    // (protection during tests/reboot)
    if (store.books.length > 0) return;

    // books.json is located in the root of the project.
    // This file is located in src/data, so we go up 
    // two levels.
    const file = Bun.file(new URL("../../books.json", import.meta.url));

    if (!(await file.exists())) {
        throw new Error("books.json not found in project root.");
    }

    const text = await file.text();
    const parsed = JSON.parse(text) as unknown;

    if (!Array.isArray(parsed)) {
        throw new Error("books.json must be an array of books.");
    }

    // Normalizes to string-year, because Book 
    // type has year: string
    // and JSON has year as number. 
    // :contentReference[oaicite:1]{index=1}
    store.books = (parsed as any[]).map((b) => ({
        id: String(b.id),
        title: String(b.title),
        author: String(b.author),
        year: String(b.year),
    })) satisfies Book[];
}
