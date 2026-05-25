import { Router } from "express";
import { EventService } from "../services/event.service";
import { createEventSchema, updateEventSchema } from "../validators/event.validator";

const eventService = new EventService();
export const eventRouter = Router();

eventRouter.post("/events", async (req, res) => {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  const saved = await eventService.createEvent(parsed.data);
  return res.status(201).json(saved);
});

eventRouter.get("/events", async (_req, res) => {
  const rows = await eventService.listEvents();
  return res.json(rows);
});

eventRouter.get("/events/:id", async (req, res) => {
  const row = await eventService.getEventById(req.params.id);
  if (!row) {
    return res.status(404).json({ message: "Event not found" });
  }
  return res.json(row);
});

eventRouter.patch("/events/:id", async (req, res) => {
  const parsed = updateEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  const saved = await eventService.updateEvent(req.params.id, parsed.data);
  if (!saved) {
    return res.status(404).json({ message: "Event not found" });
  }

  return res.json(saved);
});

eventRouter.delete("/events/:id", async (req, res) => {
  const deleted = await eventService.deleteEvent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Event not found" });
  }
  return res.status(204).send();
});
