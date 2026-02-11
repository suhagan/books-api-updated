export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
};

export type CreateCustomer = Omit<Customer, "id">;
