import { paymentConsumer } from "./client";
import { publishPaymentFailed } from "./publisher";
import { TOPICS } from "./topics";
import { PaymentService } from "../services/payment.service";
import logger from "../utils/logger";

const paymentService = new PaymentService();

export const startPaymentConsumers = async () => {
  await paymentConsumer.subscribe({ topic: TOPICS.PAYMENT_REQUESTED, fromBeginning: false });

  await paymentConsumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const data = JSON.parse(message.value.toString()) as {
        orderId: string;
        amount: number;
        currency?: string;
      };

      try {
        const payment = await paymentService.processPayment({
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          provider: "mock"
        });
        if (payment.status === "FAILED") {
          logger.warn({ orderId: data.orderId, paymentId: payment.id }, "Payment failed by saga rule");
        } else {
          logger.info({ orderId: data.orderId, paymentId: payment.id }, "Payment succeeded by saga rule");
        }
      } catch (error) {
        await publishPaymentFailed({
          orderId: data.orderId,
          reason: `Unhandled payment processing error: ${(error as Error).message}`
        });
        logger.error({ orderId: data.orderId, err: error }, "Payment crashed during saga processing");
      }
    }
  });
};
