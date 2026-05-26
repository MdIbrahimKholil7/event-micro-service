import { Kafka } from "kafkajs";
import { config } from "../config";
import { TOPIC_PARTITIONS } from "./topics";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [config.KAFKA_BROKER]
});

export const orderProducer = kafka.producer();
export const orderConsumer = kafka.consumer({ groupId: "order-service-group" });

export const ensureOrderTopics = async () => {
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

export const connectOrderKafka = async () => {
  await orderProducer.connect();
  await orderConsumer.connect();
};

export const disconnectOrderKafka = async () => {
  await orderProducer.disconnect();
  await orderConsumer.disconnect();
};
