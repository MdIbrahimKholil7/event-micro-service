import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(3).max(10).optional(),
  provider: z.string().min(1).optional()
});

export const updatePaymentSchema = z.object({
  status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
  transactionRef: z.string().optional()
});
