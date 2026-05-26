import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.string().min(1),
  eventId: z.string().min(1),
  seatCount: z.number().int().positive(),
  totalAmount: z.number().positive(),
  currency: z.string().min(3).max(10).optional()
});

export const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "CONFIRMED", "FAILED", "PAYMENT_FAILED", "CANCELLED"]).optional()
});
