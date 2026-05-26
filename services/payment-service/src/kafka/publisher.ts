import logger from "../utils/logger";
import { paymentProducer } from "./client";
import { TOPICS } from "./topics";

export const publishPaymentCreated = async (payload: {
  orderId: string;
  paymentId: string;
  amount: string;
  currency: string;
  provider: string;
  status: string;
}) => {
  await paymentProducer.send({
    topic: TOPICS.PAYMENT_CREATED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published payment created");
};

export const publishPaymentSuccess = async (payload: {
  orderId: string;
  paymentId: string;
  transactionRef: string;
}) => {
  await paymentProducer.send({
    topic: TOPICS.PAYMENT_SUCCESS,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.info({ ...payload }, "Published payment success");
};

export const publishPaymentFailed = async (payload: { orderId: string; paymentId?: string; reason: string }) => {
  await paymentProducer.send({
    topic: TOPICS.PAYMENT_FAILED,
    messages: [{ key: payload.orderId, value: JSON.stringify(payload) }]
  });
  logger.error({ ...payload }, "Published payment failure");
};
