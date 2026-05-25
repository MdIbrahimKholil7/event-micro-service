import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

@Entity({ name: "payments" })
export class PaymentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "order_id", type: "varchar", length: 100 })
  orderId!: string;

  @Column({ name: "amount", type: "numeric", precision: 12, scale: 2 })
  amount!: string;

  @Column({ name: "currency", type: "varchar", length: 10, default: "USD" })
  currency!: string;

  @Column({ name: "status", type: "varchar", length: 20, default: "PENDING" })
  status!: PaymentStatus;

  @Column({ name: "provider", type: "varchar", length: 50, default: "mock" })
  provider!: string;

  @Column({ name: "transaction_ref", type: "varchar", length: 100, nullable: true })
  transactionRef!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
