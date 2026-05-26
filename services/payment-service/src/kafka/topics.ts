export const TOPICS = {
  ORDER_CREATED: "order.created",
  ORDER_CONFIRMED: "order.confirmed",
  ORDER_CANCELLED: "order.cancelled",
  SEAT_RESERVE_REQUESTED: "seat.reserve.requested",
  SEAT_RESERVED: "seat.reserved",
  SEAT_RESERVE_FAILED: "seat.reserve.failed",
  SEAT_CONFIRM_REQUESTED: "seat.confirm.requested",
  SEAT_RELEASE_REQUESTED: "seat.release.requested",
  SEAT_CONFIRMED: "seat.confirmed",
  SEAT_RELEASED: "seat.released",
  PAYMENT_CREATED: "payment.created",
  PAYMENT_REQUESTED: "payment.requested",
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed"
} as const;

export const TOPIC_PARTITIONS: Record<string, number> = {
  [TOPICS.ORDER_CREATED]: 6,
  [TOPICS.ORDER_CONFIRMED]: 3,
  [TOPICS.ORDER_CANCELLED]: 3,
  [TOPICS.SEAT_RESERVE_REQUESTED]: 8,
  [TOPICS.SEAT_RESERVED]: 8,
  [TOPICS.SEAT_RESERVE_FAILED]: 8,
  [TOPICS.SEAT_CONFIRM_REQUESTED]: 6,
  [TOPICS.SEAT_RELEASE_REQUESTED]: 6,
  [TOPICS.SEAT_CONFIRMED]: 6,
  [TOPICS.SEAT_RELEASED]: 6,
  [TOPICS.PAYMENT_CREATED]: 6,
  [TOPICS.PAYMENT_REQUESTED]: 6,
  [TOPICS.PAYMENT_SUCCESS]: 6,
  [TOPICS.PAYMENT_FAILED]: 6
};
