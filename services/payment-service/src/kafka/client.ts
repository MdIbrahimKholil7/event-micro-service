import { Kafka } from "kafkajs";
import { config } from "../config";
import { TOPIC_PARTITIONS } from "./topics";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [config.KAFKA_BROKER]
});

export const paymentProducer = kafka.producer();
export const paymentConsumer = kafka.consumer({ groupId: "payment-service-group" });

export const ensurePaymentTopics = async () => {
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    waitForLeaders: true,
    topics: Object.entries(TOPIC_PARTITIONS).map(([topic, numPartitions]) => ({
      topic,
      numPartitions,
      replicationFactor: 1
    }))
  });
  await admin.disconnect();
};

export const connectPaymentKafka = async () => {
  await paymentProducer.connect();
  await paymentConsumer.connect();
};

export const disconnectPaymentKafka = async () => {
  await paymentProducer.disconnect();
  await paymentConsumer.disconnect();
};
