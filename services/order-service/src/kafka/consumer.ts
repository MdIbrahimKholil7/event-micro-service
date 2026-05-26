import { orderConsumer } from "./client";
import { TOPICS } from "./topics";
import { OrderService } from "../services/order.service";
import {
  publishOrderCancelled,
  publishOrderConfirmed,
  publishOrderPaymentFailed,
  publishPaymentRequested,
  publishSeatConfirmRequested,
  publishSeatReleaseRequested
} from "./publisher";
import logger from "../utils/logger";

const orderService = new OrderService();

export const startOrderConsumers = async () => {
  await orderConsumer.subscribe({ topic: TOPICS.SEAT_RESERVED, fromBeginning: false });
  await orderConsumer.subscribe({ topic: TOPICS.SEAT_RESERVE_FAILED, fromBeginning: false });
  await orderConsumer.subscribe({ topic: TOPICS.PAYMENT_CREATED, fromBeginning: false });
  await orderConsumer.subscribe({ topic: TOPICS.PAYMENT_SUCCESS, fromBeginning: false });
  await orderConsumer.subscribe({ topic: TOPICS.PAYMENT_FAILED, fromBeginning: false });

  await orderConsumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString()) as {
        orderId: string;
        eventId: string;
        seatCount: number;
        paymentId?: string;
        status?: string;
        reason?: string;
      };

      const order = await orderService.getOrderById(data.orderId);
      if (!order) return;

      if (topic === TOPICS.SEAT_RESERVED) {
        await orderService.updateOrderStatus(data.orderId, "PROCESSING");
        await publishPaymentRequested({
          orderId: order.id,
          eventId: order.eventId,
          seatCount: order.seatCount,
          amount: Number(order.totalAmount),
          currency: order.currency
        });
        logger.info({ orderId: data.orderId }, "Seat reserved, payment requested");
      }

      if (topic === TOPICS.SEAT_RESERVE_FAILED) {
        await orderService.updateOrderStatus(data.orderId, "FAILED");
        await publishOrderCancelled({ orderId: data.orderId, reason: data.reason ?? "Seat reservation failed" });
        logger.warn({ orderId: data.orderId, reason: data.reason }, "Order failed due to seat reservation");
      }

      if (topic === TOPICS.PAYMENT_CREATED) {
        if (order.status === "PENDING") {
          await orderService.updateOrderStatus(data.orderId, "PROCESSING");
        }
        logger.info({ orderId: data.orderId, paymentId: data.paymentId, paymentStatus: data.status }, "Payment record created");
      }

      console.log("Received message on topic", topic, "for order", data.orderId);
      if (topic === TOPICS.PAYMENT_SUCCESS && data.paymentId) {
        console.log("Payment success received for order", data.orderId, "with payment", data.paymentId);
        await orderService.updateOrderStatus(data.orderId, "CONFIRMED");
        await publishSeatConfirmRequested({ orderId: order.id, eventId: order.eventId, seatCount: order.seatCount });
        await publishOrderConfirmed({ orderId: data.orderId, paymentId: data.paymentId });
        logger.info({ orderId: data.orderId, paymentId: data.paymentId }, "Order confirmed by saga");
      }

      if (topic === TOPICS.PAYMENT_FAILED) {
        await orderService.updateOrderStatus(data.orderId, "PAYMENT_FAILED");
        await publishSeatReleaseRequested({ orderId: order.id, eventId: order.eventId, seatCount: order.seatCount });
        await publishOrderPaymentFailed({ orderId: data.orderId, reason: data.reason, paymentId: data.paymentId });
        await publishOrderCancelled({ orderId: data.orderId, reason: data.reason });
        logger.warn({ orderId: data.orderId, reason: data.reason }, "Order cancelled by saga");
      }
    }
  });
};
