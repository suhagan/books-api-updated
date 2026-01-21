// no change has been made so far; we keep 'year' as a 
// string for easy comparison in the query.
// We can change year as a number; we can change it 
// later + adjust the rest.

export type Book = {
  id: string;
  title: string;
  author: string;
  year: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Loan = {
  user_id: string;
  book_id: string;
  due_date: string;
  created_at: string;
};
