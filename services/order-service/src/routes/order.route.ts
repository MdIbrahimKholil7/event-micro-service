import { Router } from "express";
import { OrderService } from "../services/order.service";
import { createOrderSchema, updateOrderSchema } from "../validators/order.validator";

const orderService = new OrderService();
export const orderRouter = Router();

orderRouter.post("/orders", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.flatten() });

  try {
    const saved = await orderService.createOrder(parsed.data);
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
});

orderRouter.get("/orders", async (_req, res) => {
  const rows = await orderService.listOrders();
  return res.json(rows);
});

orderRouter.get("/orders/:id", async (req, res) => {
  const row = await orderService.getOrderById(req.params.id);
  if (!row) return res.status(404).json({ message: "Order not found" });
  return res.json(row);
});

orderRouter.patch("/orders/:id", async (req, res) => {
  const parsed = updateOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.flatten() });
  if (!parsed.data.status) return res.status(400).json({ message: "status is required" });
  const row = await orderService.updateOrderStatus(req.params.id, parsed.data.status);
  if (!row) return res.status(404).json({ message: "Order not found" });
  return res.json(row);
});
