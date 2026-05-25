import { AppDataSource } from "../db/data-source";
import { OrderEntity } from "../entities/order.entity";

export interface CreateOrderInput {
  userId: string;
  eventId: string;
  seatCount: number;
  totalAmount: number;
  currency?: string;
}

export class OrderRepository {
  private readonly repo = AppDataSource.getRepository(OrderEntity);

  public async create(input: CreateOrderInput) {
    const entity = this.repo.create({
      ...input,
      totalAmount: input.totalAmount.toFixed(2),
      currency: input.currency ?? "USD",
      status: "PENDING"
    });
    return this.repo.save(entity);
  }

  public async findMany(limit = 100) {
    return this.repo.find({ order: { createdAt: "DESC" }, take: limit });
  }

  public async findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  public async updateStatus(existing: OrderEntity, status: "PENDING" | "CONFIRMED" | "CANCELLED") {
    existing.status = status;
    return this.repo.save(existing);
  }
}
