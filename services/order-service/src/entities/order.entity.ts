import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar", length: 100 })
  userId!: string;

  @Column({ name: "event_id", type: "varchar", length: 100 })
  eventId!: string;

  @Column({ name: "seat_count", type: "int" })
  seatCount!: number;

  @Column({ name: "total_amount", type: "numeric", precision: 12, scale: 2 })
  totalAmount!: string;

  @Column({ name: "currency", type: "varchar", length: 10, default: "USD" })
  currency!: string;

  @Column({ name: "status", type: "varchar", length: 20, default: "PENDING" })
  status!: OrderStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
