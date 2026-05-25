import { AppDataSource } from "../db/data-source";
import { EventEntity } from "../entities/event.entity";

export interface CreateEventInput {
  title: string;
  description?: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  organizerId: string;
  totalSeats: number;
  published?: boolean;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  location?: string;
  startsAt?: Date;
  endsAt?: Date;
  organizerId?: string;
  totalSeats?: number;
  published?: boolean;
}

export class EventRepository {
  private readonly repo = AppDataSource.getRepository(EventEntity);

  public async create(input: CreateEventInput) {
    const event = this.repo.create({
      ...input,
      description: input.description ?? null,
      published: input.published ?? false
    });

    return this.repo.save(event);
  }

  public async findMany(limit = 100) {
    return this.repo.find({ order: { startsAt: "ASC" }, take: limit });
  }

  public async findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  public async update(existing: EventEntity, input: UpdateEventInput) {
    this.repo.merge(existing, input);
    return this.repo.save(existing);
  }

  public async deleteById(id: string) {
    const result = await this.repo.delete({ id });
    return Boolean(result.affected);
  }
}
