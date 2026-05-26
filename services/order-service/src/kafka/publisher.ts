import logger from "../utils/logger";
import { orderProducer } from "./client";
import { TOPICS } from "./topics";

export const publishSeatReserveRequested = async (payload: { orderId: string; eventId: string; seatCount: number }) => {
  await orderProducer.send({
    topic: TOPICS.SEAT_RESERVE_REQUESTED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published seat reservation request");
};

export const publishPaymentRequested = async (payload: {
  orderId: string;
  eventId: string;
  seatCount: number;
  amount: number;
  currency: string;
}) => {
  await orderProducer.send({
    topic: TOPICS.PAYMENT_REQUESTED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published payment request");
};

export const publishSeatConfirmRequested = async (payload: { orderId: string; eventId: string; seatCount: number }) => {
  await orderProducer.send({
    topic: TOPICS.SEAT_CONFIRM_REQUESTED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published seat confirmation request");
};

export const publishSeatReleaseRequested = async (payload: { orderId: string; eventId: string; seatCount: number }) => {
  await orderProducer.send({
    topic: TOPICS.SEAT_RELEASE_REQUESTED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published seat release request");
};

export const publishOrderConfirmed = async (payload: { orderId: string; paymentId: string }) => {
  await orderProducer.send({
    topic: TOPICS.ORDER_CONFIRMED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published order confirmation");
};

export const publishOrderCancelled = async (payload: { orderId: string; reason?: string }) => {
  await orderProducer.send({
    topic: TOPICS.ORDER_CANCELLED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published order cancellation");
};

export const publishOrderPaymentFailed = async (payload: { orderId: string; reason?: string; paymentId?: string }) => {
  await orderProducer.send({
    topic: TOPICS.ORDER_PAYMENT_FAILED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published order payment failure");
};
