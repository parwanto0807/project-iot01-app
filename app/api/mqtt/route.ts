// app/api/mqtt/route.ts

import { NextResponse } from 'next/server';
import mqtt, { MqttClient } from 'mqtt';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const TOPICS = process.env.MQTT_TOPICS?.split(',') || []; // Gunakan array dari variabel lingkungan

// Memastikan variabel lingkungan didefinisikan
if (!MQTT_BROKER_URL) {
    throw new Error('MQTT_BROKER_URL is not defined in .env.local');
}

if (!TOPICS || TOPICS.length === 0) {
    throw new Error('MQTT_TOPICS is not defined or empty in .env.local');
}

interface TopicData {
    [key: string]: unknown; // Menggunakan `unknown` sebagai alternatif yang lebih aman daripada `any`
}

export async function GET(): Promise<Response> {
    return new Promise((resolve, reject) => {
        const client: MqttClient = mqtt.connect(MQTT_BROKER_URL as string);

        const receivedData: TopicData = {}; // Objek untuk menyimpan data per topik
        let topicsReceived = 0;

        client.on('connect', () => {
            console.log('Connected to MQTT broker');
            client.subscribe(TOPICS as string[], (err: Error | null) => {
                if (err) {
                    console.error('Subscription error:', err);
                    reject(new Response('Subscription error', { status: 500 }));
                }
            });
        });

        client.on('message', (topic: string, message: Buffer) => {
            try {
                const data = JSON.parse(message.toString());
                console.log(`Received data on topic "${topic}":`, data);

                // Simpan data berdasarkan topik
                receivedData[topic] = data;
                topicsReceived++;

                // Jika semua topik telah menerima data
                if (topicsReceived === TOPICS.length) {
                    resolve(NextResponse.json(receivedData)); // Kirim semua data sebagai JSON
                    client.end(); // Disconnect setelah data diterima
                }
            } catch (error) {
                console.error('Error parsing message:', error);
                reject(new Response('Error parsing message', { status: 500 }));
                client.end(); // Disconnect jika terjadi kesalahan
            }
        });

        client.on('error', (err: Error) => {
            console.error('MQTT error:', err);
            reject(new Response('MQTT connection error', { status: 500 }));
            client.end(); // Disconnect jika terjadi kesalahan
        });
    });
}
