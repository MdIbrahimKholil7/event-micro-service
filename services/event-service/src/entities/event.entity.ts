import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: "events" })
export class EventEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ name: "description", type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "location", type: "varchar", length: 255 })
  location!: string;

  @Column({ name: "starts_at", type: "timestamptz" })
  startsAt!: Date;

  @Column({ name: "ends_at", type: "timestamptz" })
  endsAt!: Date;

  @Column({ name: "organizer_id", type: "varchar", length: 100 })
  organizerId!: string;

  @Column({ name: "total_seats", type: "int", default: 100 })
  totalSeats!: number;

  @Column({ name: "available_seats", type: "int", default: 100 })
  availableSeats!: number;

  @Column({ name: "published", type: "boolean", default: false })
  published!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
