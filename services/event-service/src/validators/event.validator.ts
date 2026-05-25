import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().min(3),
    description: z.string().optional(),
    location: z.string().min(2),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    organizerId: z.string().min(1),
    published: z.boolean().optional()
  })
  .refine((v) => new Date(v.endsAt).getTime() > new Date(v.startsAt).getTime(), {
    message: "endsAt must be later than startsAt",
    path: ["endsAt"]
  });

export const updateEventSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    location: z.string().min(2).optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    organizerId: z.string().min(1).optional(),
    published: z.boolean().optional()
  })
  .refine(
    (v) => !v.startsAt || !v.endsAt || new Date(v.endsAt).getTime() > new Date(v.startsAt).getTime(),
    {
      message: "endsAt must be later than startsAt",
      path: ["endsAt"]
    }
  );
