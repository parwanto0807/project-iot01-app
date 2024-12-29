"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import styles from "@/app/page.module.css";

interface DataItem {
  id: number;
  serialNumberPart: string;
  voltase: number;
  ampere: number;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect("wss://97xvrcpgto4fq9ut5a4m.cedalo.cloud:443");

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("your/topic", (err) => {
        if (err) {
          setError("Failed to subscribe to topic");
          console.error(err);
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      try {
        const receivedData: DataItem = JSON.parse(message.toString());
        setData((prevData) => [...prevData, receivedData]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to parse MQTT message:", err);
        setError("Error parsing data from MQTT broker");
      }
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT connection error:", err);
      setError("Error connecting to MQTT broker");
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1>Data Pengukuran Ampere</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Serial Number</th>
            <th>Voltase (V)</th>
            <th title="Current in Amperes">Ampere (A)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.serialNumberPart}</td>
              <td>{item.voltase}</td>
              <td>{item.ampere}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}