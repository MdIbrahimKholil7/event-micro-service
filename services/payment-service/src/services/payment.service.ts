import { PaymentRepository } from "../repositories/payment.repository";

export class PaymentService {
  private readonly repo = new PaymentRepository();

  public async createPayment(payload: { orderId: string; amount: number; currency?: string; provider?: string }) {
    return this.repo.create(payload);
  }

  public async listPayments() {
    return this.repo.findMany(100);
  }

  public async getPaymentById(id: string) {
    return this.repo.findById(id);
  }

  public async updatePayment(id: string, status: "PENDING" | "SUCCESS" | "FAILED", transactionRef?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    return this.repo.updateStatus(existing, status, transactionRef);
  }
}
