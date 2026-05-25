import { Router } from "express";
import { PaymentService } from "../services/payment.service";
import { createPaymentSchema, updatePaymentSchema } from "../validators/payment.validator";

const paymentService = new PaymentService();
export const paymentRouter = Router();

paymentRouter.post("/payments", async (req, res) => {
  const parsed = createPaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.flatten() });
  const saved = await paymentService.createPayment(parsed.data);
  return res.status(201).json(saved);
});

paymentRouter.get("/payments", async (_req, res) => {
  const rows = await paymentService.listPayments();
  return res.json(rows);
});

paymentRouter.get("/payments/:id", async (req, res) => {
  const row = await paymentService.getPaymentById(req.params.id);
  if (!row) return res.status(404).json({ message: "Payment not found" });
  return res.json(row);
});

paymentRouter.patch("/payments/:id", async (req, res) => {
  const parsed = updatePaymentSchema.safeParse(req.body);
  if (!parsed.success || !parsed.data.status) return res.status(400).json({ message: parsed.error.flatten() });
  const row = await paymentService.updatePayment(req.params.id, parsed.data.status, parsed.data.transactionRef);
  if (!row) return res.status(404).json({ message: "Payment not found" });
  return res.json(row);
});
