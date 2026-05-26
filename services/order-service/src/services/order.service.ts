import { publishSeatReserveRequested } from "../kafka/publisher";
import { OrderRepository } from "../repositories/order.repository";
import type { OrderStatus } from "../entities/order.entity";

export class OrderService {
  private readonly repo = new OrderRepository();

  public async createOrder(payload: {
    userId: string;
    eventId: string;
    seatCount: number;
    totalAmount: number;
    currency?: string;
  }) {
    const created = await this.repo.create(payload);

    try {
      await publishSeatReserveRequested({
        orderId: created.id,
        eventId: created.eventId,
        seatCount: created.seatCount
      });
    } catch {
      await this.repo.updateStatus(created, "FAILED");
      throw new Error("Failed to publish seat reservation request");
    }

    return created;
  }

  public async listOrders() {
    return this.repo.findMany(100);
  }

  public async getOrderById(id: string) {
    return this.repo.findById(id);
  }

  public async updateOrderStatus(id: string, status: OrderStatus) {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    return this.repo.updateStatus(existing, status);
  }
}
