import { EventRepository, type CreateEventInput, type UpdateEventInput } from "../repositories/event.repository";

export class EventService {
  private readonly repo = new EventRepository();

  public async createEvent(payload: Omit<CreateEventInput, "startsAt" | "endsAt"> & { startsAt: string; endsAt: string }) {
    return this.repo.create({
      ...payload,
      startsAt: new Date(payload.startsAt),
      endsAt: new Date(payload.endsAt)
    });
  }

  public async listEvents() {
    return this.repo.findMany(100);
  }

  public async getEventById(id: string) {
    return this.repo.findById(id);
  }

  public async updateEvent(
    id: string,
    payload: Omit<UpdateEventInput, "startsAt" | "endsAt"> & { startsAt?: string; endsAt?: string }
  ) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      return null;
    }

    const input: UpdateEventInput = {
      ...payload,
      startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
      endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined
    };

    return this.repo.update(existing, input);
  }

  public async deleteEvent(id: string) {
    return this.repo.deleteById(id);
  }
}
