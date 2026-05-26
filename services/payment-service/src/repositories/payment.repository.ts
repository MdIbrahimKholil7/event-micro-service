import { AppDataSource } from "../db/data-source";
import { PaymentEntity } from "../entities/payment.entity";

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency?: string;
  provider?: string;
}

export class PaymentRepository {
  private readonly repo = AppDataSource.getRepository(PaymentEntity);

  public async create(input: CreatePaymentInput) {
    const entity = this.repo.create({
      orderId: input.orderId,
      amount: input.amount.toFixed(2),
      currency: input.currency ?? "USD",
      provider: input.provider ?? "mock",
      status: "SUCCESS",
      transactionRef: null
    });
    return this.repo.save(entity);
  }

  public async findMany(limit = 100) {
    return this.repo.find({ order: { createdAt: "DESC" }, take: limit });
  }

  public async findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  public async updateStatus(existing: PaymentEntity, status: "PENDING" | "SUCCESS" | "FAILED", transactionRef?: string) {
    existing.status = status;
    if (transactionRef !== undefined) existing.transactionRef = transactionRef;
    return this.repo.save(existing);
  }
}
