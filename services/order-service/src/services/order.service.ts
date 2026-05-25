import { OrderRepository } from "../repositories/order.repository";

export class OrderService {
  private readonly repo = new OrderRepository();

  public async createOrder(payload: {
    userId: string;
    eventId: string;
    seatCount: number;
    totalAmount: number;
    currency?: string;
  }) {
    return this.repo.create(payload);
  }

  public async listOrders() {
    return this.repo.findMany(100);
  }

  public async getOrderById(id: string) {
    return this.repo.findById(id);
  }

  public async updateOrderStatus(id: string, status: "PENDING" | "CONFIRMED" | "CANCELLED") {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    return this.repo.updateStatus(existing, status);
  }
}
