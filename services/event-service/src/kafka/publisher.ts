import logger from "../utils/logger";
import { eventProducer } from "./client";
import { TOPICS } from "./topics";

export const publishSeatReserved = async (payload: { orderId: string; eventId: string; seatCount: number }) => {
  await eventProducer.send({ topic: TOPICS.SEAT_RESERVED, messages: [{ key: payload.orderId, value: JSON.stringify(payload) }] });
  logger.info({ ...payload }, "Published seat reservation");
};

export const publishSeatReserveFailed = async (payload: { orderId: string; eventId: string; seatCount: number; reason: string }) => {
  await eventProducer.send({ topic: TOPICS.SEAT_RESERVE_FAILED, messages: [{ key: payload.orderId, value: JSON.stringify(payload) }] });
  logger.info({ ...payload }, "Published seat reservation failure");
};

export const publishSeatConfirmed = async (payload: { orderId: string; eventId: string; seatCount: number }) => {
  await eventProducer.send({ topic: TOPICS.SEAT_CONFIRMED, messages: [{ key: payload.orderId, value: JSON.stringify(payload) }] });
  logger.info({ ...payload }, "Published seat confirmation");
};

export const publishSeatReleased = async (payload: { orderId: string; eventId: string; seatCount: number }) => {
  await eventProducer.send({ topic: TOPICS.SEAT_RELEASED, messages: [{ key: payload.orderId, value: JSON.stringify(payload) }] });
  logger.info({ ...payload }, "Published seat release");
};
