export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  isbn: string | null;
  price: string; // Postgres NUMERIC comes as string
  stock_quantity: number;
};

export type CreateBook = {
  title: string;
  author: string;
  year: number;
  isbn?: string | null;
  price: number;
  stock_quantity?: number;
};

export type UpdateBook = Partial<CreateBook>;
