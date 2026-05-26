import { eventConsumer } from "./client";
import { TOPICS } from "./topics";
import { EventService } from "../services/event.service";
import { publishSeatConfirmed, publishSeatReleased, publishSeatReserveFailed, publishSeatReserved } from "./publisher";
import logger from "../utils/logger";

const eventService = new EventService();

export const startEventConsumers = async () => {
  await eventConsumer.subscribe({ topic: TOPICS.SEAT_RESERVE_REQUESTED, fromBeginning: false });
  await eventConsumer.subscribe({ topic: TOPICS.SEAT_CONFIRM_REQUESTED, fromBeginning: false });
  await eventConsumer.subscribe({ topic: TOPICS.SEAT_RELEASE_REQUESTED, fromBeginning: false });
  logger.info(
    {
      topics: [TOPICS.SEAT_RESERVE_REQUESTED, TOPICS.SEAT_CONFIRM_REQUESTED, TOPICS.SEAT_RELEASE_REQUESTED]
    },
    "Event consumers subscribed"
  );

  await eventConsumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString()) as {
        orderId: string;
        eventId: string;
        seatCount: number;
      };
      logger.info({ topic, orderId: data.orderId, eventId: data.eventId, seatCount: data.seatCount }, "Event consumer received message");

      if (topic === TOPICS.SEAT_RESERVE_REQUESTED) {
        const result = await eventService.reserveSeats(data.eventId, data.seatCount);
        if (result.ok) {
          await publishSeatReserved(data);
          logger.info({ ...data }, "Seats reserved");
        } else {
          await publishSeatReserveFailed({ ...data, reason: result.reason });
          logger.warn({ ...data, reason: result.reason }, "Seat reservation failed");
        }
      }

      if (topic === TOPICS.SEAT_CONFIRM_REQUESTED) {
        console.log(`Received seat confirmation request for order ${data.orderId}, event ${data.eventId}, seats ${data.seatCount}`);
        const result = await eventService.confirmSeats(data.eventId, data.seatCount);
        if (result.ok) {
          await publishSeatConfirmed(data);
          logger.info({ ...data }, "Seats confirmed");
        } else {
          logger.warn({ ...data, reason: result.reason }, "Seat confirmation failed");
        }
      }

      if (topic === TOPICS.SEAT_RELEASE_REQUESTED) {
        const result = await eventService.releaseSeats(data.eventId, data.seatCount);
        if (result.ok) {
          await publishSeatReleased(data);
          logger.info({ ...data }, "Seats released");
        } else {
          logger.warn({ ...data, reason: result.reason }, "Seat release failed");
        }
      }
    }
  });
};
