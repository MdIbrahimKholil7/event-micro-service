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
      published: input.published ?? false,
      availableSeats: input.totalSeats,
      reservedSeats: 0,
      soldSeats: 0
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

  public async reserveSeats(eventId: string, seatCount: number) {
    const event = await this.repo.findOneBy({ id: eventId });
    if (!event) return { ok: false as const, reason: "EVENT_NOT_FOUND" };
    if (event.availableSeats < seatCount) return { ok: false as const, reason: "INSUFFICIENT_SEATS" };

    event.availableSeats -= seatCount;
    event.reservedSeats += seatCount;
    await this.repo.save(event);
    return { ok: true as const };
  }

  public async confirmSeats(eventId: string, seatCount: number) {
    const event = await this.repo.findOneBy({ id: eventId });
    if (!event) return { ok: false as const, reason: "EVENT_NOT_FOUND" };
    if (event.reservedSeats < seatCount) return { ok: false as const, reason: "INVALID_RESERVED_COUNT" };

    event.reservedSeats -= seatCount;
    event.soldSeats += seatCount;
    await this.repo.save(event);
    return { ok: true as const };
  }

  public async releaseSeats(eventId: string, seatCount: number) {
    const event = await this.repo.findOneBy({ id: eventId });
    if (!event) return { ok: false as const, reason: "EVENT_NOT_FOUND" };
    if (event.reservedSeats < seatCount) return { ok: false as const, reason: "INVALID_RESERVED_COUNT" };

    event.reservedSeats -= seatCount;
    event.availableSeats += seatCount;
    await this.repo.save(event);
    return { ok: true as const };
  }

  public async deleteById(id: string) {
    const result = await this.repo.delete({ id });
    return Boolean(result.affected);
  }
}
