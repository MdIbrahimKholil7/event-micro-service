import { PaymentRepository } from "../repositories/payment.repository";
import type { PaymentStatus } from "../entities/payment.entity";
import { publishPaymentCreated, publishPaymentFailed, publishPaymentSuccess } from "../kafka/publisher";
import logger from "../utils/logger";

export class PaymentService {
  private readonly repo = new PaymentRepository();

  public async createPayment(payload: { orderId: string; amount: number; currency?: string; provider?: string }) {
    const payment = await this.repo.create(payload);
    await publishPaymentCreated({
      orderId: payment.orderId,
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      status: payment.status
    });
    return payment;
  }

  public async processPayment(payload: { orderId: string; amount: number; currency?: string; provider?: string }) {
    let paymentId: string | undefined;
    try {
      const payment = await this.createPayment(payload);
      paymentId = payment.id;

      if (payload.amount > 10000) {
        const failed = await this.updatePayment(payment.id, "FAILED", `txn_fail_${payment.id}`);
        await publishPaymentFailed({
          orderId: payment.orderId,
          paymentId: payment.id,
          reason: "Amount exceeds mock processing limit"
        });
        return failed ?? payment;
      }
      throw new Error("Simulated processing error for testing");
      const transactionRef = `txn_${payment.id}`;
      const success = await this.updatePayment(payment.id, "SUCCESS", transactionRef);
      await publishPaymentSuccess({ orderId: payment.orderId, paymentId: payment.id, transactionRef });
      return success ?? payment;
    } catch (err) {
      if (paymentId) {
        await this.updatePayment(paymentId, "FAILED", `txn_fail_${paymentId}`).catch(() => undefined);
      }
      await publishPaymentFailed({
        orderId: payload.orderId,
        reason: `Unhandled error during payment processing: ${(err as Error).message}`
      });
      logger.error({ orderId: payload.orderId, paymentId, err }, "Payment processing failed");
      throw err;
    }
  }

  public async listPayments() {
    return this.repo.findMany(100);
  }

  public async getPaymentById(id: string) {
    return this.repo.findById(id);
  }

  public async updatePayment(id: string, status: PaymentStatus, transactionRef?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) return null;
    return this.repo.updateStatus(existing, status, transactionRef);
  }
}
