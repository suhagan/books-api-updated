import { withTransaction } from "../db/client";
import { BadRequestError, NotFoundError } from "../errors/api-error";
import { BooksRepository } from "../repositories/books.repository";
import { CustomersRepository } from "../repositories/customers.repository";
import { OrdersRepository } from "../repositories/orders.repository";
import type { CreateOrderInput } from "../types/orders.types";

export class OrdersService {
  constructor(
    private ordersRepo = new OrdersRepository(),
    private booksRepo = new BooksRepository(),
    private customersRepo = new CustomersRepository()
  ) {}

  async list() {
    return this.ordersRepo.getAll();
  }

  async listByCustomer(customerId: number) {
    // Ensure customer exists (nice UX)
    const customer = await this.customersRepo.getById(customerId);
    if (!customer) throw new NotFoundError("Customer not found");
    return this.ordersRepo.getByCustomerId(customerId);
  }

  async create(input: CreateOrderInput) {
    if (!input.items?.length) throw new BadRequestError("Order must contain at least one item");

    const customer = await this.customersRepo.getById(input.customer_id);
    if (!customer) throw new NotFoundError("Customer not found");

    //return await withTransaction(async () => {
      // 1) create order header
      const order = await this.ordersRepo.createOrderHeader(input.customer_id);

      // 2) validate books + stock, add items, decrement stock
      for (const item of input.items) {
        const book = await this.booksRepo.getById(item.book_id);
        if (!book) throw new NotFoundError(`Book not found: ${item.book_id}`);

        const unitPrice = Number(book.price);

        const ok = await this.booksRepo.decrementStock(item.book_id, item.quantity);
        if (!ok) {
          throw new BadRequestError(`Not enough stock for book_id=${item.book_id}`);
        }

        await this.ordersRepo.addOrderItem(order.id, item.book_id, item.quantity, unitPrice);
      }

      // 3) update total
      await this.ordersRepo.updateOrderTotal(order.id);

      // 4) return updated order header
      //const [updated] = await this.ordersRepo.getByCustomerId(input.customer_id);
      // Above returns latest first; good enough for assignment
      //return { created: true, order_id: order.id, customer_id: input.customer_id };
      return { created: true, order_id: Number(order.id), customer_id: input.customer_id };

    };
}
