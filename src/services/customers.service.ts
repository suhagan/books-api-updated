import { CustomersRepository } from "../repositories/customers.repository";
import { NotFoundError } from "../errors/api-error";
import type { CreateCustomer } from "../types/customers.types";

export class CustomersService {
  constructor(private repo = new CustomersRepository()) {}

  async list() {
    return this.repo.getAll();
  }

  async get(id: number) {
    const customer = await this.repo.getById(id);
    if (!customer) throw new NotFoundError("Customer not found");
    return customer;
  }

  async create(input: CreateCustomer) {
    return this.repo.create(input);
  }

  async delete(id: number) {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundError("Customer not found");
    return { deleted: true };
  }
}
