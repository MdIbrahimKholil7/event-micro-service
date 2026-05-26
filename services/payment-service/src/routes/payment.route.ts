import { Router } from "express";
import { HttpError } from "../errors/http-error";
import { PaymentService } from "../services/payment.service";
import { asyncHandler } from "../utils/async-handler";
import { createPaymentSchema, updatePaymentSchema } from "../validators/payment.validator";

const paymentService = new PaymentService();
export const paymentRouter = Router();

paymentRouter.post(
  "/payments",
  asyncHandler(async (req, res) => {
    const parsed = createPaymentSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Validation failed", parsed.error.flatten());
    const saved = await paymentService.processPayment(parsed.data);
    return res.status(201).json(saved);
  })
);

paymentRouter.get(
  "/payments",
  asyncHandler(async (_req, res) => {
    const rows = await paymentService.listPayments();
    return res.json(rows);
  })
);

paymentRouter.get(
  "/payments/:id",
  asyncHandler(async (req, res) => {
    const row = await paymentService.getPaymentById(req.params.id);
    if (!row) throw new HttpError(404, "Payment not found");
    return res.json(row);
  })
);

paymentRouter.patch(
  "/payments/:id",
  asyncHandler(async (req, res) => {
    const parsed = updatePaymentSchema.safeParse(req.body);
    if (!parsed.success) throw new HttpError(400, "Validation failed", parsed.error.flatten());
    if (!parsed.data.status) throw new HttpError(400, "status is required");
    const row = await paymentService.updatePayment(req.params.id, parsed.data.status, parsed.data.transactionRef);
    if (!row) throw new HttpError(404, "Payment not found");
    return res.json(row);
  })
);
