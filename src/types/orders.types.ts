export type OrderStatus = "NEW" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export type Order = {
  id: number;
  customer_id: number;
  status: OrderStatus;
  total_amount: string; // NUMERIC -> string
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  unit_price: string;
};

export type CreateOrderItemInput = {
  book_id: number;
  quantity: number;
};

export type CreateOrderInput = {
  customer_id: number;
  items: CreateOrderItemInput[];
};
