// app/api/mqtt/route.ts

import { NextResponse } from 'next/server';
import mqtt from 'mqtt';

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const TOPIC = process.env.MQTT_TOPIC;

// Memastikan variabel lingkungan didefinisikan
if (!MQTT_BROKER_URL) {
    throw new Error('MQTT_BROKER_URL is not defined in .env.local');
}

if (!TOPIC) {
    throw new Error('MQTT_TOPIC is not defined in .env.local');
}

export async function GET(): Promise<Response> { // Menambahkan tipe kembalian Promise<Response>
    return new Promise((resolve, reject) => {
        const client = mqtt.connect(MQTT_BROKER_URL as string); // Sekarang TypeScript tahu ini adalah string

        client.on('connect', () => {
            console.log('Connected to MQTT broker');
            client.subscribe(TOPIC as string, (err) => { // Menambahkan as string untuk memastikan tipe
                if (err) {
                    console.error('Subscription error:', err);
                    reject(new Response('Subscription error', { status: 500 }));
                }
            });
        });

        client.on('message', (topic, message) => {
            // Pesan yang diterima dari broker
            try {
                const data = JSON.parse(message.toString());
                console.log('Received data:', data);
                
                // Kirim data ke client
                resolve(NextResponse.json(data)); // Mengembalikan Response yang valid
            } catch (error) {
                console.error('Error parsing message:', error);
                reject(new Response('Error parsing message', { status: 500 }));
            } finally {
                // Disconnect after receiving the message
                client.end();
            }
        });

        client.on('error', (err) => {
            console.error('MQTT error:', err);
            reject(new Response('MQTT connection error', { status: 500 }));
        });
    });
}