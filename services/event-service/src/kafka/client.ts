import { Kafka } from "kafkajs";
import { config } from "../config";
import { TOPIC_PARTITIONS } from "./topics";

const kafka = new Kafka({
  clientId: "event-service",
  brokers: [config.KAFKA_BROKER]
});

export const eventProducer = kafka.producer();
export const eventConsumer = kafka.consumer({ groupId: "event-service-group" });

export const ensureEventTopics = async () => {
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

export const connectEventKafka = async () => {
  await eventProducer.connect();
  await eventConsumer.connect();
};

export const disconnectEventKafka = async () => {
  await eventProducer.disconnect();
  await eventConsumer.disconnect();
};
