import { getDb } from "../db/client";
import type { CreateOrderInput, Order, OrderItem } from "../types/orders.types";

export class OrdersRepository {
  private db = getDb();

  async getAll(): Promise<Order[]> {
    return await this.db<Order[]>`
      SELECT id, customer_id, status, total_amount, created_at
      FROM orders
      ORDER BY id DESC
    `;
  }

  async getByCustomerId(customerId: number): Promise<Order[]> {
    return await this.db<Order[]>`
      SELECT id, customer_id, status, total_amount, created_at
      FROM orders
      WHERE customer_id = ${customerId}
      ORDER BY id DESC
    `;
  }

//   async createOrderHeader(customerId: number): Promise<Order> {
//     const rows = await this.db<Order[]>`
//       INSERT INTO orders (customer_id, status, total_amount)
//       VALUES (${customerId}, 'NEW', 0)
//       RETURNING id, customer_id, status, total_amount, created_at
//     `;
//     return rows[0]!;
//   }

    async createOrderHeader(customerId: number): Promise<Order> {
    const rows = await this.db<Order[]>`
        INSERT INTO orders (customer_id, status, total_amount)
        VALUES (${customerId}, 'NEW', 0)
        RETURNING
        id::int as id,
        customer_id,
        status,
        total_amount,
        created_at
    `;
    return rows[0]!;
    }


  async addOrderItem(orderId: number, bookId: number, quantity: number, unitPrice: number): Promise<OrderItem> {
    const rows = await this.db<OrderItem[]>`
      INSERT INTO order_items (order_id, book_id, quantity, unit_price)
      VALUES (${orderId}, ${bookId}, ${quantity}, ${unitPrice})
      RETURNING
        id::int as id,
        order_id::int as order_id,
        book_id::int as book_id,
        quantity,
        unit_price
        `;
    return rows[0]!;
  }

  async updateOrderTotal(orderId: number): Promise<void> {
    await this.db`
      UPDATE orders
      SET total_amount = (
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM order_items
        WHERE order_id = ${orderId}
      ),
      updated_at = NOW()
      WHERE id = ${orderId}
    `;
  }
}
